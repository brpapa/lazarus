import { GraphQLFieldConfig } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { ReportIncidentMutationType } from './report-incident'

export const incidentMutationsFields: Record<string, GraphQLFieldConfig<any, GraphQLContext>> = {
  reportIncident: ReportIncidentMutationType,
}
