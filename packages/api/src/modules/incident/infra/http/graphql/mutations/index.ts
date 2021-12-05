import { GraphQLFieldConfig } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { CreateIncidentMutationType } from './create-incident'

export const incidentMutationsFields: Record<string, GraphQLFieldConfig<any, GraphQLContext>> = {
  createIncident: CreateIncidentMutationType,
}