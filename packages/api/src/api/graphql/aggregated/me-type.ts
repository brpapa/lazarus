import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql'
import { connectionArgs, connectionFromArray } from 'graphql-relay'
import { MeStatsDTO } from 'src/api/graphql/aggregated/me-dto'
import { GraphQLContext } from 'src/api/graphql/context'
import { NotificationConnectionDTO } from 'src/modules/notification/adapter/dtos/notification-dto'
import { myNotificationsQuery } from 'src/modules/notification/application/queries'
import { NotificationConnectionType } from 'src/modules/notification/infra/graphql/types/notification-type'
import { UserDTO } from 'src/modules/user/adapter/dtos/user-dto'
import { GetUserById } from 'src/modules/user/application/queries'
import { UserType } from 'src/modules/user/infra/graphql/types/user-type'
import { usersQuery } from 'src/modules/user/application/queries/index'
import { incidentsQuery } from 'src/modules/incident/application/queries'

const ME_TYPE_NAME = 'Me'

export const MeType = new GraphQLObjectType<Record<string, never>, GraphQLContext>({
  name: ME_TYPE_NAME,
  fields: () => ({
    user: {
      resolve: async (_, __, ctx): Promise<UserDTO | null> => {
        if (ctx.userId === null) return null
        return GetUserById.gen({ userId: ctx.userId }, ctx)
      },
      type: UserType,
    },
    notifications: {
      description: 'Notifications of requester user ordered by the most recents',
      args: connectionArgs,
      resolve: async (_, args, ctx): Promise<NotificationConnectionDTO> => {
        const { notifications, totalCount, notSeenCount } = await myNotificationsQuery.exec({}, ctx)
        const connection = connectionFromArray(notifications, args)
        return { ...connection, totalCount, notSeenCount }
      },
      type: GraphQLNonNull(NotificationConnectionType),
    },
    stats: {
      description: 'Statistics related to requester user',
      resolve: async (_, __, ctx): Promise<MeStatsDTO> => {
        if (ctx.userId === null) return {}
        const userDto = await GetUserById.gen({ userId: ctx.userId }, ctx)
        if (!userDto?.location) return {}

        const withinCircle = {
          center: userDto.location,
          radiusInMeters: userDto.preferences.radiusDistance,
        }

        const { totalCount: nearbyUsersCount } = await usersQuery.exec(
          { filter: { withinCircle, excluding: [ctx.userId] } },
          ctx,
        )
        const { totalCount: nearbyIncidentsCount } = await incidentsQuery.exec(
          { filter: { withinCircle } },
          ctx,
        )

        return {
          nearbyUsersCount,
          nearbyIncidentsCount,
        }
      },
      type: GraphQLNonNull(
        new GraphQLObjectType<MeStatsDTO, GraphQLContext>({
          name: 'Stats',
          fields: () => ({
            nearbyIncidentsCount: {
              description: 'Count of incidents nearby to me based on my distanceRadius preference',
              resolve: (stats) => stats.nearbyIncidentsCount,
              type: GraphQLInt,
            },
            nearbyUsersCount: {
              description:
                'Count of users nearby to me (not counting me) based on my distanceRadius preference',
              resolve: (stats) => stats.nearbyUsersCount,
              type: GraphQLInt,
            },
          }),
        }),
      ),
    },
  }),
})
