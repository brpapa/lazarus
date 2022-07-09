import { err, ok, Result } from '@lazarus/shared'
import { Debugger } from 'debug'
import { NotificationDTO } from 'src/modules/notification/adapter/dtos/notification-dto'
import { NotificationMapper } from 'src/modules/notification/adapter/mappers/notification-mapper'
import { INotificationRepo } from 'src/modules/notification/adapter/repositories/notification-repo'
import { AppContext } from 'src/modules/shared/logic/app-context'
import { Command } from 'src/modules/shared/logic/command'
import { ApplicationError, UnauthorizedError } from 'src/modules/shared/logic/errors'

export type Input = {
  notificationId: string
}
export type OkRes = NotificationDTO
export type ErrRes = NotificationNotFound | UnauthorizedError
export type Res = Result<OkRes, ErrRes>

export class MarkNotificationAsSeenCommand extends Command<Input, Res> {
  constructor(log: Debugger, private notificationRepo: INotificationRepo) {
    super(log)
  }

  async execImpl(input: Input, ctx: AppContext): Promise<Res> {
    const notification = await this.notificationRepo.findById(input.notificationId)
    if (notification === null)
      return err(new NotificationNotFound(`Notification ${input.notificationId} not found`))

    if (ctx.userId !== notification.targetUserId)
      return err(
        new UnauthorizedError(
          `The requester user '${ctx.userId}' is not the target user of this notification: '${notification.targetUserId}'`,
        ),
      )

    notification.markAsSeen()
    await this.notificationRepo.commit(notification)

    return ok(NotificationMapper.fromDomainToDTO(notification))
  }
}

export class NotificationNotFound extends ApplicationError {
  constructor(reason: string) {
    super(undefined, reason)
  }
}
