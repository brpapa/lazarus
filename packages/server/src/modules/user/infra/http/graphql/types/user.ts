import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql'
import { globalIdField } from 'graphql-relay'
import { connectionDefinitions } from 'src/shared/infra/graphql/connections'
import { GraphQLCustomTypes } from 'src/infra/http/graphql/node'

export const UserType = GraphQLCustomTypes.register(
  new GraphQLObjectType({
    name: 'User',
    // interfaces: [nodeInterface], // this type implements the Node GraphQL interface
    fields: () => ({
      // id: {
      //   ...globalIdField('User'),
      //   description: 'The opaque identifier of this node',
      // },
      _id: {
        type: GraphQLString,
        description: 'The user id',
        resolve: (user) => user._id,
      },
      name: {
        type: GraphQLString,
        resolve: (user) => user.name,
      },
      email: {
        type: GraphQLString,
        resolve: (user) => user.email,
      },
    }),
  }),
)

export const { connectionType: UserConnectionType, edgeType: UserEdgeType } = connectionDefinitions(
  {
    name: 'User',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    nodeType: GraphQLNonNull(UserType),
  },
)
