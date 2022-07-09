import { GraphQLContext } from 'src/api/graphql/context'
import { NotificationDTO } from '../../adapter/dtos/notification-dto'
import { NotificationMapper } from '../../adapter/mappers/notification-mapper'

export class GetNotificationById {
  static async gen(
    args: { notificationId: string },
    ctx: GraphQLContext,
  ): Promise<NotificationDTO | null> {
    const notification = await ctx.loaders.notification.load(args.notificationId)
    return notification !== null ? NotificationMapper.fromDomainToDTO(notification) : null
  }
}
