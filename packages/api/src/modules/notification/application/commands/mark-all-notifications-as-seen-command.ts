import { err, ok, Result } from '@lazarus/shared'
import { NotificationDTO } from 'src/modules/notification/adapter/dtos/notification-dto'
import { NotificationMapper } from 'src/modules/notification/adapter/mappers/notification-mapper'
import { INotificationRepo } from 'src/modules/notification/adapter/repositories/notification-repo'
import { AppContext } from 'src/modules/shared/logic/app-context'
import { Command } from 'src/modules/shared/logic/command'
import { UnauthenticatedError } from 'src/modules/shared/logic/errors'
import { Debugger } from 'debug'

export type Input = Record<string, never>
export type OkRes = NotificationDTO[]
export type ErrRes = UnauthenticatedError
export type Res = Result<OkRes, ErrRes>

export class MarkAllNotificationsAsSeenCommand extends Command<Input, Res> {
  constructor(log: Debugger, private notificationRepo: INotificationRepo) {
    super(log)
  }

  async execImpl(_: Input, ctx?: AppContext): Promise<Res> {
    const userId = ctx?.userId
    if (!userId) return err(new UnauthenticatedError())

    const notifications = await this.notificationRepo.findAllOfTargetUserId(userId)

    notifications.map((notification) => notification.markAsSeen())
    await this.notificationRepo.commitBatch(notifications)

    return ok(notifications.map((n) => NotificationMapper.fromDomainToDTO(n)))
  }
}
