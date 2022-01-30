import { NotificationDTO } from '@notification/adapter/dtos/notification-dto'
import { NotificationMapper } from '@notification/adapter/mappers/notification-mapper'
import { INotificationRepo } from '@notification/adapter/repositories/notification-repo'
import { Command } from '@shared/logic/command'
import { err, ok, Result } from '@metis/shared'
import { Debugger } from 'debug'
import { AppContext } from '@shared/logic/app-context'
import { ApplicationError } from '@shared/logic/errors'

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

  async execImpl(input: Input, ctx?: AppContext): Promise<Res> {
    const notification = await this.notificationRepo.findById(input.notificationId)
    if (notification === null)
      return err(new NotificationNotFound(`Notification ${input.notificationId} not found`))

    if (ctx?.userId !== notification.targetUserId)
      return err(
        new UnauthorizedError(
          `The requester user '${ctx?.userId}' is not the target user of this notification: '${notification.targetUserId}'`,
        ),
      )

    notification.see()
    await this.notificationRepo.commit(notification)

    return ok(NotificationMapper.fromDomainToDTO(notification))
  }
}

export class NotificationNotFound extends ApplicationError {
  constructor(reason: string) {
    super(undefined, reason)
  }
}
export class UnauthorizedError extends ApplicationError {
  constructor(reason: string) {
    super(undefined, reason)
  }
}
