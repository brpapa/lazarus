import { GraphQLFieldConfig, GraphQLInputObjectType, GraphQLNonNull } from 'graphql'
import { Connection, connectionArgs, ConnectionArguments, connectionFromArray } from 'graphql-relay'
import { GraphQLContext } from 'src/api/graphql/context'
import { IncidentDTO } from '@incident/adapter/dtos/incident-dto'
import { getIncidents } from '@incident/application/queries'
import { LocationInputType } from '@shared/infra/graphql/types/location-type'
import { IncidentConnectionType } from '../types/incident-type'

const IncidentsFilterInputType = new GraphQLInputObjectType({
  name: 'IncidentsFilterInputType',
  fields: () => ({
    withinBoundary: {
      type: new GraphQLInputObjectType({
        name: 'WithinBoundaryInput',
        description: 'Filter by incidents localizated within a box boundary',
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
    ctx,
  ): Promise<Connection<IncidentDTO>> => {
    const incidents = await getIncidents.exec({ filter: args.filter }, ctx)
    if (incidents.isErr()) throw incidents.error
    return connectionFromArray(incidents.value, args)
  },
}
