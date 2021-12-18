import { GraphQLFieldConfig } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { IncidentQueryType } from './incident-query-type'
import { IncidentsQueryType } from './incidents-query-type'

export const incidentQueryFields: Record<string, GraphQLFieldConfig<void, GraphQLContext, any>> = {
  incident: IncidentQueryType,
  incidents: IncidentsQueryType,
}
