import { IncidentDTO } from 'src/modules/incident/adapter/dtos/incident-dto'
import { GetIncidentById } from 'src/modules/incident/application/queries'
import { GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { IncidentType } from '../types/incident-type'

export const IncidentQueryType: GraphQLFieldConfig<void, GraphQLContext, any> = {
  type: IncidentType,
  args: {
    incidentId: {
      description: 'The incident id',
      type: GraphQLNonNull(GraphQLString),
    },
  },
  resolve: async (_, args: { incidentId: string }, ctx): Promise<IncidentDTO | null> => {
    return GetIncidentById.gen(args, ctx)
  },
}
