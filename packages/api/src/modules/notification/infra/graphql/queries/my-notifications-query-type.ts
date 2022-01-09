import { NotificationDTO } from '@notification/adapter/dtos/notification-dto'
import { getMyNotifications } from '@notification/application/queries'
import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql'
import { Connection, connectionArgs, ConnectionArguments, connectionFromArray } from 'graphql-relay'
import { GraphQLContext } from 'src/api/graphql/context'
import { NotificationConnectionType } from '../types/notification-type'

export const MyNotificationsQueryType: GraphQLFieldConfig<void, GraphQLContext, any> = {
  type: GraphQLNonNull(NotificationConnectionType),
  args: connectionArgs,
  resolve: async (_, args: ConnectionArguments, ctx): Promise<Connection<NotificationDTO>> => {
    const notifications = await getMyNotifications.exec({}, ctx)
    return connectionFromArray(notifications, args)
  },
}
