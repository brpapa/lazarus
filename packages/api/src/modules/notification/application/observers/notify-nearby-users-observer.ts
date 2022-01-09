import { t } from '@metis/shared'
import assert from 'assert'
import { Debugger } from 'debug'
import { INotificationRepo } from '@notification/adapter/notification-repo'
import { IPushNotificationService } from '@notification/adapter/push-notification-service'
import {
  Notification,
  NotificationType,
} from '@notification/domain/models/notification'
import {
  LinkedEntity,
  NotificationLink,
} from '@notification/domain/models/notification-link'
import { DomainEvents } from '@shared/domain/events/domain-events'
import { IObserver } from '@shared/domain/events/observer'
import { zip } from '@shared/logic/helpers/zip'
import { IncidentCreatedEnrichedWithNearbyUsers } from '@user/domain/events/incident-created-enriched-with-nearby-users'
import { IDeviceRepo } from '../../adapter/device-repo'
import { PushMessage } from '../../domain/models/push-message'

/**
 * create a new notification entity to be displayed on notifications tab
 * and send push notifications for relevant users about a new incident created nearby them
 */
export class NotifyNearbyUsersObserver
  implements IObserver<IncidentCreatedEnrichedWithNearbyUsers>
{
  MAX_DISTANCE_INCIDENT_TO_USER_IN_METERS = 2000

  constructor(
    private log: Debugger,
    private deviceRepo: IDeviceRepo,
    private pushNotificationService: IPushNotificationService,
    private notificationRepo: INotificationRepo,
  ) {
    DomainEvents.subscribeObserver(this, IncidentCreatedEnrichedWithNearbyUsers.eventName)
  }

  async handle(event: IncidentCreatedEnrichedWithNearbyUsers) {
    // create notifications of type 'NearbyIncidentCreated' for all nearby users
    const notifications = event.nearbyUsers.map((nearbyUser) =>
      Notification.create({
        targetUserId: nearbyUser.userId,
        type: NotificationType.NEARBY_INCIDENT_CREATED,
        title: t('notifications.nearbyIncidentCreated.title'),
        subtitle: t('notifications.nearbyIncidentCreated.subtitle', {
          incidentTitle: event.incident.title,
        }),
        body: t('notifications.nearbyIncidentCreated.body', {
          distInMeters: nearbyUser.distanceIncidentToUserInMeters,
        }),
        link: NotificationLink.create({
          entity: LinkedEntity.INCIDENT,
          entityId: event.incident.id.toString(),
        }),
      }),
    )
    await this.notificationRepo.commitBatch(notifications)

    // fetch push tokens of users and send push notifications for each one
    const pushMessages = await this.toPushMessages(notifications)
    const pushTickets = await this.pushNotificationService.sendPushNotifications(pushMessages)

    this.log(`Messages sent to Expo server: %o`, pushTickets)
  }

  private async toPushMessages(notifications: Notification[]): Promise<PushMessage[]> {
    const targetUsersId = notifications.map((notification) => notification.targetUserId)
    const usersDevices = await this.deviceRepo.findAllOfUserBatch(targetUsersId)

    return zip(notifications, usersDevices).map(([notification, userDevices]) => {
      assert(notification && userDevices)
      assert(userDevices.every((userDevice) => userDevice.userId === notification.targetUserId))

      const pushTokens = userDevices
        .map(({ pushToken }) => pushToken)
        .filter((pushToken) => {
          const isValid = this.pushNotificationService.isPushToken(pushToken)
          if (!isValid)
            this.log(`[warn] Ignoring device because the push token ${pushToken} is not valid`)
          return isValid
        })

      if (pushTokens.length === 0)
        this.log('[warn] User %o has not any valid push token saved', notification.targetUserId)

      return notification.toPushMessage(pushTokens)
    })
  }
}
