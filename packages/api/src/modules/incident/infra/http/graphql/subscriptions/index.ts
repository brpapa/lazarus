import { GraphQLNonNull, GraphQLFieldConfig } from 'graphql'
import { pubSub, events } from 'src/infra/http/graphql/pub-sub'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { IncidentType } from '../types/incident'

const IncidentCreatedOutputType = GraphQLNonNull(IncidentType)

/*
  Resolvers for subscription are slightly different from others:
    - Rather than returning any data directly, they return an AsyncIterator which subsequently is used by the GraphQL server to push the event data to the client.
    - Subscription resolvers are wrapped inside an object and need to be provided as the value for a subscribe field. You also need to provide another field called resolve that actually returns the data from the data emitted by the AsyncIterator.
*/

const IncidentCreatedSubscriptionType = {
  type: IncidentCreatedOutputType,
  description: 'Triggered whenever a new incident is created',
  subscribe: () => pubSub.asyncIterator(events.INCIDENT.CREATED),
}

export const incidentSubscriptionsFields: Record<
  string,
  GraphQLFieldConfig<void, GraphQLContext>
> = {
  incidentCreated: IncidentCreatedSubscriptionType,
}
