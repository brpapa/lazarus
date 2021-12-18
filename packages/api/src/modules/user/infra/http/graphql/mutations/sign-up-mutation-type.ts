import { GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { signUpCommand } from 'src/modules/user/application/commands'
import { SignUpInput, SignUpOkOutput } from 'src/modules/user/application/commands/sign-up-command'
import { createMutationWithClientMutationId } from 'src/shared/infra/graphql/create-mutation'

export const SignUpMutationType = createMutationWithClientMutationId<
  GraphQLContext,
  SignUpInput,
  SignUpOkOutput
>({
  name: 'SignUp',
  inputFields: {
    username: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    phoneNumber: { type: GraphQLNonNull(GraphQLString) }
  },
  mutateAndGetPayload: async (args, ctx) => {
    const output = await signUpCommand.exec(args, ctx)
    if (output.isErr()) throw output.error
  },
  outputFields: {},
})
