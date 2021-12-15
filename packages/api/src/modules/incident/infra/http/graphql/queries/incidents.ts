import {
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql'
import { Connection, connectionFromArray } from 'graphql-relay'
import { connectionArgs, ConnectionArguments } from 'graphql-relay'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { IncidentDTO } from 'src/modules/incident/adapter/dtos/incident'
import { getIncidentsWithinBoundary } from 'src/modules/incident/application/queries'
import { CoordinateInputType } from 'src/shared/infra/graphql/types/coordinate'
import { IncidentConnectionType, IncidentType } from '../types/incident'

const IncidentsFilterInputType = new GraphQLInputObjectType({
  name: 'IncidentsFilterInputType',
  fields: () => ({
    withinBoundary: {
      type: new GraphQLInputObjectType({
        name: 'WithinBoundaryInput',
        description: 'Filter by incidents localizated within a box boundary',
        fields: () => ({
          northEast: {
            type: GraphQLNonNull(CoordinateInputType),
          },
          southWest: {
            type: GraphQLNonNull(CoordinateInputType),
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
        withinBoundary?: {
          northEast: { latitude: number; longitude: number }
          southWest: { latitude: number; longitude: number }
        }
      }
    },
  ): Promise<Connection<IncidentDTO>> => {
    const incidents = await getIncidentsWithinBoundary.exec({ filter: args.filter })
    if (incidents.isErr()) throw incidents.error
    return connectionFromArray(incidents.value, args)
  },
}
