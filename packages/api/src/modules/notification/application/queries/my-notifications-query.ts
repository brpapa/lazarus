import { NotificationDTO } from 'src/modules/notification/adapter/dtos/notification-dto'
import { NotificationMapper } from 'src/modules/notification/adapter/mappers/notification-mapper'
import { INotificationRepo } from 'src/modules/notification/adapter/repositories/notification-repo'
import { AppContext } from 'src/modules/shared/logic/app-context'
import { Query } from 'src/modules/shared/logic/query'
import { Debugger } from 'debug'

export type Input = Record<string, never>
export type Res = {
  notifications: NotificationDTO[]
  totalCount: number
  notSeenCount: number
}

export class MyNotificationsQuery extends Query<Input, Res> {
  constructor(log: Debugger, private notificationRepo: INotificationRepo) {
    super(log)
  }

  async execImpl(req: Input, ctx: AppContext): Promise<Res> {
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
