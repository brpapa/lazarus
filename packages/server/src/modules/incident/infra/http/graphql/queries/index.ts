import { GraphQLString, GraphQLNonNull, GraphQLFieldConfig, GraphQLList, GraphQLInt } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { CoordinateDTO } from 'src/shared/adapter/dtos/coordinate'
import { IncidentDTO } from 'src/modules/incident/adapter/dtos/incident'
import { GetIncidentById } from 'src/modules/incident/application/queries/get-incident-by-id'
import { GetNearbyIncidents } from 'src/modules/incident/application/queries/get-nearby-incidents'
import { CoordinateType } from '../../../../../../shared/infra/graphql/types/coordinate'
import { IncidentType } from '../types/incident'

export const incidentQueryFields: Record<string, GraphQLFieldConfig<void, GraphQLContext, any>> = {
  incident: {
    type: IncidentType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLString),
        description: 'The incident id',
      },
    },
    resolve: (_, args: { id: string }, ctx): Promise<IncidentDTO | null> =>
      GetIncidentById.gen(args, ctx),
  },
  nearbyIncidents: {
    type: GraphQLList(IncidentType),
    description: 'Search for all incidents localizated inside the circle',
    args: {
      centerCoordinate: {
        type: GraphQLNonNull(CoordinateType),
      },
      radius: {
        type: GraphQLNonNull(GraphQLInt),
      },
    },
    resolve: (
      _,
      args: { centerCoordinate: CoordinateDTO; radius: number },
      ctx,
    ): Promise<IncidentDTO[]> => GetNearbyIncidents.gen(args, ctx),
  },
}
