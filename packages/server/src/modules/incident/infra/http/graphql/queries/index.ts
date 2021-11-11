import { GraphQLFieldConfig } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { incident } from './incident'
import { incidentsWithinBoundary } from './incidents-within-boundary'

export const incidentQueryFields: Record<string, GraphQLFieldConfig<void, GraphQLContext, any>> = {
  incident,
  incidentsWithinBoundary,
}
