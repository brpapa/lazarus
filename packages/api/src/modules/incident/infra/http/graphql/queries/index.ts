import { GraphQLFieldConfig } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { IncidentQueryType } from './incident'
import { IncidentsWithinBoundaryQueryType } from './incidents-within-boundary'

export const incidentQueryFields: Record<string, GraphQLFieldConfig<void, GraphQLContext, any>> = {
  incident: IncidentQueryType,
  incidentsWithinBoundary: IncidentsWithinBoundaryQueryType,
}
