import { GraphQLString, GraphQLNonNull } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import { generateToken } from '../../../presentation/auth'
import pubSub, { events } from '../../../presentation/pub-sub'

import UserModel from '../user-model'

export default mutationWithClientMutationId({
  name: 'UserRegisterWithEmail',
  inputFields: {
    name: {
      type: GraphQLNonNull(GraphQLString),
    },
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
  mutateAndGetPayload: async ({ name, email, password }) => {
    let user = await UserModel.findOne({ email: email.toLowerCase() })

    if (user) {
      return {
        error: 'Email already in use',
      }
    }

    user = new UserModel({
      name,
      email,
      password,
    })

    await user.save()

    await pubSub.publish(events.USER.ADDED, { UserAdded: { user } })

    return {
      // @ts-ignore
      token: generateToken(user),
    }
  },
})
