import { NotificationDTO } from '@notification/adapter/dtos/notification-dto'
import { GetNotificationById } from '@notification/application/queries'
import { GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { NotificationType } from '../types/notification-type'

export const NotificationQueryType: GraphQLFieldConfig<void, GraphQLContext, any> = {
  type: NotificationType,
  args: {
    notificationId: {
      description: 'The notification id',
      type: GraphQLNonNull(GraphQLString),
    },
  },
  resolve: async (_, args: { notificationId: string }, ctx): Promise<NotificationDTO | null> =>
    GetNotificationById.gen(args, ctx),
}
