import { NotificationDTO } from '@notification/adapter/dtos/notification-dto'
import { NotificationMapper } from '@notification/adapter/mappers/notification-mapper'
import { INotificationRepo } from '@notification/adapter/repositories/notification-repo'
import { AppContext } from '@shared/logic/app-context'
import { Query } from '@shared/logic/query'
import { Debugger } from 'debug'

export type GetMyNotificationsInput = Record<string, never>
export type GetMyNotificationsResult = {
  notifications: NotificationDTO[]
  totalCount: number
  notSeenCount: number
}

export class GetMyNotifications extends Query<GetMyNotificationsInput, GetMyNotificationsResult> {
  constructor(log: Debugger, private notificationRepo: INotificationRepo) {
    super(log)
  }

  async execImpl(req: GetMyNotificationsInput, ctx: AppContext): Promise<GetMyNotificationsResult> {
    if (ctx.userId === null) {
      this.log('[warn] User is not authenticated to show your notifications')
      return { notifications: [], totalCount: 0, notSeenCount: 0 }
    }

    const notifications = await this.notificationRepo.findAllOfTargetUserId(ctx.userId)

    return {
      notifications: notifications.map(NotificationMapper.fromDomainToDTO),
      totalCount: notifications.length,
      notSeenCount: notifications.filter((n) => n.seenByTargetUser === false).length,
    }
  }
}
