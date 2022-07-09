import { GraphQLFieldConfig, GraphQLFloat, GraphQLInputObjectType, GraphQLNonNull } from 'graphql'
import { connectionArgs, ConnectionArguments, connectionFromArray } from 'graphql-relay'
import { GraphQLContext } from 'src/api/graphql/context'
import { IncidentConnectionDTO } from 'src/modules/incident/adapter/dtos/incident-dto'
import { incidentsQuery } from 'src/modules/incident/application/queries'
import { WithinBoxFilter, WithinCircleFilter } from 'src/modules/shared/adapter/dtos/filters'
import { LocationInputType } from 'src/modules/shared/infra/graphql/types/location-type'
import { IncidentConnectionType } from '../types/incident-type'

const IncidentsFilterInputType = new GraphQLInputObjectType({
  name: 'IncidentsFilterInputType',
  fields: () => ({
    withinBox: {
      type: new GraphQLInputObjectType({
        name: 'IncidentsFilterWithinBox',
        description: 'Filter by incidents located within the boundaries of given box',
        fields: () => ({
          northEast: {
            type: GraphQLNonNull(LocationInputType),
          },
          southWest: {
            type: GraphQLNonNull(LocationInputType),
          },
        }),
      }),
    },
    withinCircle: {
      type: new GraphQLInputObjectType({
        name: 'IncidentsFilterWithinCircle',
        description: 'Filter by incidents located within the boundaries of given circle',
        fields: () => ({
          center: {
            type: GraphQLNonNull(LocationInputType),
          },
          radius: {
            type: GraphQLNonNull(GraphQLFloat),
            description: 'The circle radius given in meters',
          },
        }),
      }),
    },
  }),
})

export const IncidentsQueryType: GraphQLFieldConfig<void, GraphQLContext, any> = {
  type: GraphQLNonNull(IncidentConnectionType),
  args: {
    ...connectionArgs,
    filter: {
      type: IncidentsFilterInputType,
    },
  },
  resolve: async (
    _,
    args: ConnectionArguments & {
      filter?: {
        withinBox?: WithinBoxFilter
        withinCircle?: WithinCircleFilter
      }
    },
    ctx,
  ): Promise<IncidentConnectionDTO> => {
    const { incidents, totalCount } = await incidentsQuery.exec(args, ctx)
    const connection = connectionFromArray(incidents, args)
    return { ...connection, totalCount }
  },
}
