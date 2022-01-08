import { t } from '@metis/shared'
import assert from 'assert'
import { Debugger } from 'debug'
import { IncidentCreated } from 'src/modules/incident/domain/events/incident-created'
import { Incident } from 'src/modules/incident/domain/models/incident'
import { DomainEvents } from 'src/modules/shared/domain/events/domain-events'
import { IObserver } from 'src/modules/shared/domain/events/observer'
import { zip } from 'src/modules/shared/logic/helpers/zip'
import { UserWithinCircle } from 'src/modules/user/adapter/repositories/user-repo'
import { userRepo } from 'src/modules/user/infra/db/repositories'
import { IDeviceRepo } from '../../adapter/device-repo'
import { IPushNotificationService, PushMessage } from '../../adapter/push-notification-service'

type NearbyUser = {
  userId: string
  distanceIncidentToUserInMeters: number
  pushTokens: string[]
}

/**
 * notify relevant users about a new incident created nearby them
 * create a new notification entity to be displayed on notifications tab
 */
export class NotifyNearbyUsersObserver implements IObserver<IncidentCreated> {
  MAX_DISTANCE_INCIDENT_TO_USER_IN_METERS = 2000

  constructor(
    private log: Debugger,
    private deviceRepo: IDeviceRepo,
    private pushNotificationService: IPushNotificationService,
  ) {
    DomainEvents.subscribeObserver(this, IncidentCreated.eventName)
  }

  async handle({ incident }: IncidentCreated) {
    const users = (
      await userRepo.findAllLocatedWithinCircle(
        incident.location,
        this.MAX_DISTANCE_INCIDENT_TO_USER_IN_METERS,
      )
    ).filter((user) => user.user.id.toString() !== incident.ownerUserId.toString())
    const nearbyUsers = await this.aggregateToNearbyUsers(users)
    this.log(`Found %o users nearby to new incident %o`, nearbyUsers.length, incident.id.toString())
    const pushMessages = this.createPushMessages(nearbyUsers, incident)
    const pushTickets = await this.pushNotificationService.sendPushNotifications(pushMessages)
    this.log(`Messages sent to Expo server: %o`, pushTickets)
    // TODO: atualiza no incident a quantidade de usuarios notificatos

    // TODO:
    // const notification = Notification.create({ userId, incidentId: event.incident.id.toString() })
    // await this.notificationRepo.commit(notification)
  }

  private async aggregateToNearbyUsers(users: UserWithinCircle[]): Promise<NearbyUser[]> {
    const usersDevices = await this.deviceRepo.findAllOfUserBatch(
      users.map(({ user }) => user.id.toString()),
    )
    const nearbyUsers = zip(users, usersDevices).map(([nearbyUser, userDevices]) => {
      assert(nearbyUser && userDevices)
      return {
        userId: nearbyUser.user.id.toString(),
        distanceIncidentToUserInMeters: nearbyUser.distanteToCenterInMeters,
        pushTokens: userDevices.map(({ pushToken }) => pushToken),
      }
    })
    return nearbyUsers
  }

  private createPushMessages(nearbyUsers: NearbyUser[], incident: Incident): PushMessage[] {
    const pushMessages = nearbyUsers.map<PushMessage>((user) => {
      const validPushTokens = user.pushTokens.filter((pushToken) => {
        const isValid = this.pushNotificationService.isPushToken(pushToken)
        if (!isValid)
          this.log(`[warn] Ignoring device because the push token ${pushToken} is not valid`)
        return isValid
      })

      if (validPushTokens.length === 0)
        this.log('[warn] User %o has not any push token saved', user.userId)

      return {
        to: validPushTokens,
        title: t('notifications.nearbyIncidentCreated.title'),
        subtitle: t('notifications.nearbyIncidentCreated.subtitle', {
          incidentTitle: incident.title,
        }),
        body: t('notifications.nearbyIncidentCreated.body', {
          distInMeters: user.distanceIncidentToUserInMeters,
        }),
        data: { incidentId: incident.id.toString() },
        sound: 'default',
      }
    })
    return pushMessages
  }
}
