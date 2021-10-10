import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql'
import { nodeField } from '../../../shared/gql/node'
import userQueries from '../../../modules/user/queries'

export const QueryRootType = new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all queries',
  fields: () => ({
    health: {
      type: GraphQLNonNull(GraphQLString),
      description: 'Health check',
      resolve: () => 'It is alive!',
    },
    node: {
      ...nodeField,
      description:
        'Enable clients to handling caching and data refetching of any gql type that implements the Node gql interface, based on Relay specs',
    },
    ...userQueries
  }),
})
