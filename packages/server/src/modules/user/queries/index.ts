import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql'
import { connectionArgs, fromGlobalId } from 'graphql-relay'
import UserType, { UserConnection } from '../user-type'
import * as UserLoader from '../user-loader'

const userQueryFields = {
  me: {
    type: UserType,
    description: 'The current logged user',
    resolve: (root: any, args: any, ctx: any) =>
      ctx.user ? UserLoader.loadUser(ctx, ctx.user._id) : null,
  },
  user: {
    type: UserType,
    args: {
      id: {
        type: GraphQLNonNull(GraphQLID),
      },
    },
    resolve: (parent: any, args: any, ctx: any) => {
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
    resolve: (parent: any, args: UserLoader.UserArgs, ctx: any) => UserLoader.loadUsers(ctx, args),
  },
}

export default userQueryFields
