import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql'
import { globalIdField } from 'graphql-relay'

import { connectionDefinitions } from '../../../lib/gql/connection'
import { registerType, nodeInterface } from '../../../lib/gql/node'

const UserType = registerType(
  new GraphQLObjectType({
    name: 'User',
    interfaces: [nodeInterface], // this type implements the Node interface
    fields: () => ({
      id: {
        ...globalIdField('User'),
        description: 'The opaque identifier of this node',
      },
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
      active: {
        type: GraphQLBoolean,
        resolve: (user) => user.active,
      },
    }),
  }),
)

export default UserType

export const UserConnection = connectionDefinitions({
  name: 'User',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  nodeType: GraphQLNonNull(UserType),
})
