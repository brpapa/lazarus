import { GraphQLString, GraphQLNonNull } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import { GraphQLContext } from '../../../presentation/type-declarations'

import UserType from '../user-type'
import * as UserLoader from '../user-loader'

/**
 * Helper function to build mutations with single input type and client mutation Id
 */
export default mutationWithClientMutationId({
  name: 'UserChangePassword',
  inputFields: {
    oldPassword: {
      type: GraphQLNonNull(GraphQLString),
    },
    password: {
      type: GraphQLNonNull(GraphQLString),
      description: 'user new password',
    },
  },
  outputFields: {
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
    me: {
      type: UserType,
      resolve: (obj, args, ctx) => UserLoader.loadUser(ctx, ctx.user.id),
    },
  },
  mutateAndGetPayload: async ({ oldPassword, password }, { user }: GraphQLContext) => {
    if (!user) {
      return {
        error: 'User not authenticated',
      }
    }

    const correctPassword = user.authenticate(oldPassword)

    if (!correctPassword) {
      return {
        error: 'INVALID_PASSWORD',
      }
    }

    user.password = password
    await user.save()

    return {
      error: null,
    }
  },
})
