import { GraphQLString, GraphQLNonNull, GraphQLFieldConfig } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { IncidentDTO } from 'src/modules/incident/adapter/dtos/incident'
import { GetIncidentById } from 'src/modules/incident/application/queries/get-incident-by-id'
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
      GetIncidentById.gen(args.id, ctx),
  },
}
