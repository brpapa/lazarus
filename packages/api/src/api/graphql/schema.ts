import { GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { nodeField } from 'src/api/graphql/node'
import * as IncidentOperations from 'src/modules/incident/infra/graphql'
import * as NotificationOperations from 'src/modules/notification/infra/graphql'
import * as UserOperations from 'src/modules/user/infra/graphql'
import * as AggregatedOperations from './aggregated'

const QueryType = new GraphQLObjectType<void, GraphQLContext>({
  name: 'Query',
  description: 'The query root type',
  fields: () => ({
    health: {
      type: GraphQLNonNull(GraphQLString),
      description: 'Health check',
      resolve: () => 'It is alive!',
    },
    node: {
      ...nodeField,
      description:
        'Based on Relay specs, enable clients to handling caching and data refetching for any GraphQL type that implements the Node Interface',
    },
    me: AggregatedOperations.MeQueryType,
    incident: IncidentOperations.IncidentQueryType,
    incidents: IncidentOperations.IncidentsQueryType,
    notification: NotificationOperations.NotificationQueryType,
  }),
})

const MutationType = new GraphQLObjectType<void, GraphQLContext>({
  name: 'Mutation',
  description: 'The mutation root type',
  fields: () => ({
    signUp: UserOperations.SignUpMutationType,
    signIn: UserOperations.SignInMutationType,
    updateUserLocation: UserOperations.UpdateUserLocationMutationType,
    refreshToken: UserOperations.RefreshTokenMutationType,
    reportIncident: IncidentOperations.ReportIncidentMutationType,
    markNotificationAsSeen: NotificationOperations.MarkNotificationAsSeenMutationType,
    markAllNotificationsAsSeen: NotificationOperations.MarkAllNotificationsAsSeenMutationType,
  }),
})

/*
  Resolvers for subscription are slightly different from others:
    - Rather than returning any data directly, they return an AsyncIterator which subsequently is used by the GraphQL server to push the event data to the client.
    - Subscription resolvers are wrapped inside an object and need to be provided as the value for a subscribe field. You also need to provide another field called resolve that actually returns the data from the data emitted by the AsyncIterator.
*/
const SubscriptionType = new GraphQLObjectType<any, GraphQLContext>({
  name: 'Subscription',
  description: 'The subscription root type',
  fields: () => ({
    onNearbyIncidentCreated: IncidentOperations.OnNearbyIncidentCreatedSubscriptionType,
  }),
})

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
  subscription: SubscriptionType,
})
