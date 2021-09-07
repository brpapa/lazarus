import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql'
import { connectionArgs, fromGlobalId } from 'graphql-relay'

import UserType, { UserConnection } from '../../modules/user/user-type'
import { nodeField } from '../../../lib/gql/node'
import * as UserLoader from '../../modules/user/user-loader'

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
    me: {
      type: UserType,
      description: 'The current logged user',
      resolve: (root, args, ctx) => (ctx.user ? UserLoader.loadUser(ctx, ctx.user._id) : null),
    },
    user: {
      type: UserType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (parent, args, ctx) => {
        const { id } = fromGlobalId(args.id)
        return UserLoader.loadUser(ctx, id)
      },
    },
    users: {
      type: UserConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
          description: 'Name of user to search by',
        },
      },
      resolve: (parent, args: UserLoader.UserArgs, ctx) => UserLoader.loadUsers(ctx, args),
    },
  }),
})
