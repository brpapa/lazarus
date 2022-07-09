import { GraphQLFieldConfig, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { incidentsQuery } from 'src/modules/incident/application/queries'
import { MeIncidentsQueryType } from 'src/modules/incident/infra/graphql/queries/me-incidents-query-type'
import { MeNotificationsQueryType } from 'src/modules/notification/infra/graphql/queries/me-notifications-query-type'
import { GetUserById } from 'src/modules/user/application/queries'
import { usersQuery } from 'src/modules/user/application/queries/index'
import { MeUserQueryType } from 'src/modules/user/infra/graphql/queries/me-user-query-type'

interface MeStatsDTO {
  nearbyIncidentsCount?: number
  nearbyUsersCount?: number
}

const MeStatsQueryType: GraphQLFieldConfig<Record<string, never>, GraphQLContext, any> = {
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
      { filter: { withinCircle, exceptUserIds: [ctx.userId] } },
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
}

export const MeType = new GraphQLObjectType<Record<string, never>, GraphQLContext>({
  name: 'Me',
  fields: () => ({
    user: MeUserQueryType,
    notifications: MeNotificationsQueryType,
    stats: MeStatsQueryType,
    incidents: MeIncidentsQueryType,
  }),
})
