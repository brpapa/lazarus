import { NotificationDTO } from '@notification/adapter/dtos/notification-dto'
import { NotificationMapper } from '@notification/adapter/mappers/notification-mapper'
import { INotificationRepo } from '@notification/adapter/repositories/notification-repo'
import { AppContext } from '@shared/logic/app-context'
import { Query } from '@shared/logic/query'
import { Debugger } from 'debug'

export type GetMyNotificationsInput = Record<string, never>
export type GetMyNotificationsResult = NotificationDTO[]

export class GetMyNotifications extends Query<GetMyNotificationsInput, GetMyNotificationsResult> {
  constructor(log: Debugger, private notificationRepo: INotificationRepo) {
    super(log)
  }

  async execImpl(req: GetMyNotificationsInput, ctx: AppContext): Promise<GetMyNotificationsResult> {
    if (ctx.userId === null) {
      this.log('[warn] User is not authenticated to show your notifications')
      return []
    }
    const notifications = await this.notificationRepo.findAllOfTargetUserId(ctx.userId)
    return notifications.map(NotificationMapper.fromDomainToDTO)
  }
}
