import { GraphQLString, GraphQLNonNull } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import { generateToken } from '../../../presentation/auth'
import UserModel from '../user-model'

export default mutationWithClientMutationId({
  name: 'UserLoginWithEmail',
  inputFields: {
    email: {
      type: GraphQLNonNull(GraphQLString),
    },
    password: {
      type: GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    token: {
      type: GraphQLString,
      resolve: ({ token }) => token,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
  mutateAndGetPayload: async ({ email, password }) => {
    const user = await UserModel.findOne({ email: email.toLowerCase() })

    const defaultErrorMessage = 'Invalid credentials'
    if (!user) {
      return {
        error: defaultErrorMessage,
      }
    }

    const correctPassword = user.authenticate(password)

    if (!correctPassword) {
      return {
        error: defaultErrorMessage,
      }
    }

    return {
      // @ts-ignore
      token: generateToken(user),
    }
  },
})
