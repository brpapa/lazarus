import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { nodeField } from 'src/api/graphql/node'
import * as IncidentQueries from '@incident/infra/graphql/queries'
import * as IncidentMutations from '@incident/infra/graphql/mutations'
import * as IncidentSubscriptions from '@incident/infra/graphql/subscriptions'
import * as UserQueries from '@user/infra/graphql/queries'
import * as UserMutations from '@user/infra/graphql/mutations'
import * as UserSubscriptions from '@user/infra/graphql/subscriptions'
import * as NotificationQueries from '@notification/infra/graphql/queries'
import * as NotificationMutations from '@notification/infra/graphql/mutations'

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
    me: UserQueries.MeQueryType,
    users: UserQueries.UsersQueryType,
    incident: IncidentQueries.IncidentQueryType,
    incidents: IncidentQueries.IncidentsQueryType,
    notification: NotificationQueries.NotificationQueryType,
    myNotifications: NotificationQueries.MyNotificationsQueryType,
  }),
})

// each mutation field should be created based on relay specs: https://github.com/graphql/graphql-relay-js#mutations
const MutationType = new GraphQLObjectType<void, GraphQLContext>({
  name: 'Mutation',
  description: 'The mutation root type',
  fields: () => ({
    signUp: UserMutations.SignUpMutationType,
    signIn: UserMutations.SignInMutationType,
    updateUserLocation: UserMutations.UpdateUserLocationMutationType,
    refreshToken: UserMutations.RefreshTokenMutationType,
    reportIncident: IncidentMutations.ReportIncidentMutationType,
    seeNotification: NotificationMutations.SeeNotificationMutationType,
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
    onUserAdded: UserSubscriptions.OnUserAddedSubscriptionType,
    onNearbyIncidentCreated: IncidentSubscriptions.OnNearbyIncidentCreatedSubscriptionType,
  }),
})

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
  subscription: SubscriptionType,
})
