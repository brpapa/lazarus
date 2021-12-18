import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { nodeField } from 'src/infra/http/graphql/node'
import { incidentQueryFields as incidentQueriesFields } from 'src/modules/incident/infra/http/graphql/queries'
import { incidentSubscriptionsFields } from 'src/modules/incident/infra/http/graphql/subscriptions'
import { incidentMutationsFields } from 'src/modules/incident/infra/http/graphql/mutations'
import { userQueriesFields } from 'src/modules/user/infra/http/graphql/queries'
import { userMutationsFields } from 'src/modules/user/infra/http/graphql/mutations'
import { userSubscriptionsFields } from 'src/modules/user/infra/http/graphql/subscriptions'

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
    ...userQueriesFields,
    ...incidentQueriesFields,
  }),
})

// each mutation field should be created based on relay specs: https://github.com/graphql/graphql-relay-js#mutations
const MutationType = new GraphQLObjectType<void, GraphQLContext>({
  name: 'Mutation',
  description: 'The mutation root type',
  fields: () => ({
    ...userMutationsFields,
    ...incidentMutationsFields,
  }),
})

const SubscriptionType = new GraphQLObjectType<void, GraphQLContext>({
  name: 'Subscription',
  description: 'The subscription root type',
  fields: () => ({
    ...userSubscriptionsFields,
    ...incidentSubscriptionsFields,
  }),
})

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
  subscription: SubscriptionType,
})
