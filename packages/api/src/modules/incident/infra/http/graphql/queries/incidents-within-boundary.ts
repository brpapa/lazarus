import {
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { IncidentDTO } from 'src/modules/incident/adapter/dtos/incident'
import { getIncidentsWithinBoundary } from 'src/modules/incident/application/queries'
import { CoordinateInputType } from 'src/shared/infra/graphql/types/coordinate'
import { IncidentType } from '../types/incident'

const IncidentsWithinBoundaryInputType = new GraphQLInputObjectType({
  name: 'IncidentsWithinBoundaryInput',
  fields: () => ({
    boundary: {
      type: GraphQLNonNull(BoundaryInputType),
    },
    first: {
      type: GraphQLInt,
    },
  }),
})

const BoundaryInputType = new GraphQLInputObjectType({
  name: 'BoundaryInput',
  description: 'The corner coordinates visible in map view',
  fields: () => ({
    northEast: {
      type: GraphQLNonNull(CoordinateInputType),
    },
    southWest: {
      type: GraphQLNonNull(CoordinateInputType),
    },
  }),
})

export const IncidentsWithinBoundaryQueryType: GraphQLFieldConfig<void, GraphQLContext, any> = {
  description: 'Search for all incidents localizated within the given box boundary',
  type: GraphQLNonNull(GraphQLList(IncidentType)),
  args: {
    input: {
      type: GraphQLNonNull(IncidentsWithinBoundaryInputType),
    },
  },
  resolve: async (
    _,
    args: {
      input: {
        boundary: {
          northEast: { latitude: number; longitude: number }
          southWest: { latitude: number; longitude: number }
        }
        first?: number
      }
    },
  ): Promise<IncidentDTO[]> => {
    const incidents = await getIncidentsWithinBoundary.exec(args.input)
    if (incidents.isErr()) throw incidents.error
    return incidents.value
  },
}
