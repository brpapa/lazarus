import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql'
import { globalIdField } from 'graphql-relay'
import { connectionDefinitions } from 'src/shared/infra/graphql/connections'
import { GraphQLTypes, nodeInterface } from 'src/infra/http/graphql/node'

const USER_TYPE_NAME = 'User'

export const UserType = GraphQLTypes.register(
  new GraphQLObjectType({
    name: USER_TYPE_NAME,
    interfaces: [nodeInterface], // this type implements the Node GraphQL interface
    fields: () => ({
      id: {
        ...globalIdField(USER_TYPE_NAME),
        description: 'The opaque identifier of GraphQL node, based on relay specs',
      },
      userId: {
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
    name: USER_TYPE_NAME,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    nodeType: GraphQLNonNull(UserType),
  },
)
