import { GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { signUpCommand } from 'src/modules/user/application/commands'
import { SignUpInput, SignUpOkOutput } from 'src/modules/user/application/commands/sign-up-command'
import { GetUserById } from 'src/modules/user/application/queries/get-user-by-id'
import { createMutation } from 'src/shared/infra/graphql/create-mutation'
import { UserType } from '../types/user-type'

export const SignUpMutationType = createMutation<GraphQLContext, SignUpInput, SignUpOkOutput>({
  name: 'SignUp',
  inputFields: {
    username: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    phoneNumber: { type: GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetPayload: async (args, ctx) => {
    const output = await signUpCommand.exec(args, ctx)
    if (output.isErr()) throw output.error
    return output.value
  },
  outputFields: {
    user: {
      type: GraphQLNonNull(UserType),
      resolve: (payload, _, ctx) => GetUserById.gen(payload, ctx),
    },
  },
})
