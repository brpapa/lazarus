import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
// import { nodeField } from 'src/infra/http/graphql/node'
// import { userQueryFields } from 'src/modules/user/infra/http/graphql/queries'
import { incidentQueryFields } from 'src/modules/incident/infra/http/graphql/queries'
// import { userSubscriptionFields } from 'src/modules/user/infra/http/graphql/subscriptions'
import { incidentSubscriptionFields } from 'src/modules/incident/infra/http/graphql/subscriptions'
// import { userMutationFields } from 'src/modules/user/infra/http/graphql/mutations'
import { incidentMutationFields } from 'src/modules/incident/infra/http/graphql/mutations'
import { userQueryFields } from 'src/modules/user/infra/http/graphql/queries'
import { userMutationFields } from 'src/modules/user/infra/http/graphql/mutations'
import { userSubscriptionFields } from 'src/modules/user/infra/http/graphql/subscriptions'

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType<void, GraphQLContext>({
    name: 'Query',
    description: 'The query root type',
    fields: () => ({
      health: {
        type: GraphQLNonNull(GraphQLString),
        description: 'Health check',
        resolve: () => 'It is alive!',
      },
      // node: {
      //   ...nodeField,
      //   description:
      //     'Based on Relay specs, enable clients to handling caching and data refetching for any GraphQL type that implements the Node Interface',
      // },
      ...userQueryFields,
      ...incidentQueryFields,
    }),
  }),
  mutation: new GraphQLObjectType<void, GraphQLContext>({
    name: 'Mutation',
    description: 'The mutation root type',
    fields: () => ({
      ...userMutationFields,
      ...incidentMutationFields,
    }),
  }),
  subscription: new GraphQLObjectType<void, GraphQLContext>({
    name: 'Subscription',
    description: 'The subscription root type',
    fields: () => ({
      ...userSubscriptionFields,
      ...incidentSubscriptionFields,
    }),
  }),
})
