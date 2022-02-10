import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql'
import { connectionArgs, connectionFromArray } from 'graphql-relay'
import { GraphQLContext } from 'src/api/graphql/context'
import { NotificationConnectionDTO } from 'src/modules/notification/adapter/dtos/notification-dto'
import { myNotificationsQuery } from 'src/modules/notification/application/queries'
import { NotificationConnectionType } from 'src/modules/notification/infra/graphql/types/notification-type'

export const MeNotificationsQueryType: GraphQLFieldConfig<
  Record<string, never>,
  GraphQLContext,
  any
> = {
  description: 'Notifications of requester user ordered by the most recents',
  args: connectionArgs,
  type: GraphQLNonNull(NotificationConnectionType),
  resolve: async (_, args, ctx): Promise<NotificationConnectionDTO> => {
    const { notifications, totalCount, notSeenCount } = await myNotificationsQuery.exec({}, ctx)
    const connection = connectionFromArray(notifications, args)
    return { ...connection, totalCount, notSeenCount }
  },
}
