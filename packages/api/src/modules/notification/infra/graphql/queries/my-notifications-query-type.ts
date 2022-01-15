import { NotificationDTO } from '@notification/adapter/dtos/notification-dto'
import { getMyNotifications } from '@notification/application/queries'
import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql'
import { Connection, connectionArgs, ConnectionArguments, connectionFromArray } from 'graphql-relay'
import { GraphQLContext } from 'src/api/graphql/context'
import { NotificationConnectionType } from '../types/notification-type'

type NotificationConnectionDTO = Connection<NotificationDTO> & {
  totalCount: number
  notSeenCount: number
}

export const MyNotificationsQueryType: GraphQLFieldConfig<void, GraphQLContext, any> = {
  type: GraphQLNonNull(NotificationConnectionType),
  description: 'Get notifications of current user ordered by most recent',
  args: connectionArgs,
  resolve: async (_, args: ConnectionArguments, ctx): Promise<NotificationConnectionDTO> => {
    const res = await getMyNotifications.exec({}, ctx)
    const connection = connectionFromArray(res.notifications, args)
    return { ...connection, totalCount: res.totalCount, notSeenCount: res.notSeenCount }
  },
}
