import { GraphQLNonNull } from 'graphql'
import { events, pubSub } from 'src/infra/http/graphql/pub-sub'
import { IncidentType } from '../types/incident-type'

const IncidentCreatedOutputType = GraphQLNonNull(IncidentType)

export const IncidentCreatedSubscriptionType = {
  type: IncidentCreatedOutputType,
  description: 'Triggered whenever a new incident is created',
  subscribe: () => pubSub.asyncIterator(events.INCIDENT.CREATED),
}
