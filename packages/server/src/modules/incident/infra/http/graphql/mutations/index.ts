import { GraphQLFieldConfig } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { IncidentType } from '../types/incident'

export const incidentMutationFields: Record<string, GraphQLFieldConfig<any, GraphQLContext>> = {
  CreateIncident: {
    type: IncidentType,
    resolve: (_, args, ctx) => {},
  },
}
