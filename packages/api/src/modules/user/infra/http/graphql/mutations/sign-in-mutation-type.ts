import { GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { signInCommand } from 'src/modules/user/application/commands'
import { SignInInput, SignInOkOutput } from 'src/modules/user/application/commands/sign-in-command'
import { createMutation } from 'src/shared/infra/graphql/create-mutation'

export const SignInMutationType = createMutation<GraphQLContext, SignInInput, SignInOkOutput>({
  name: 'SignIn',
  inputFields: {
    username: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetPayload: async (args, ctx): Promise<SignInOkOutput> => {
    const output = await signInCommand.exec(args, ctx)
    if (output.isErr()) throw output.error
    return output.value
  },
  outputFields: {
    accessToken: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (payload) => payload.accessToken,
    },
    refreshToken: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (payload) => payload.refreshToken,
    },
  },
})
