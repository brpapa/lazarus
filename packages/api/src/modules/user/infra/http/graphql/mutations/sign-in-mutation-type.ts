import { GraphQLEnumType, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { signInCommand } from 'src/modules/user/application/commands'
import { SignInInput, SignInResult } from 'src/modules/user/application/commands/sign-in-command'
import { createMutationType } from 'src/shared/infra/graphql/create-mutation-type'
import { BusinessError } from 'src/shared/logic/errors'

export const SignInMutationType = createMutationType<GraphQLContext, SignInInput, SignInResult>({
  name: 'SignIn',
  inputFields: {
    username: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetResult: async (args, ctx) => signInCommand.exec(args, ctx),
  okResultFields: {
    accessToken: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (result) => result.asOk().accessToken,
    },
    refreshToken: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (result) => result.asOk().refreshToken,
    },
  },
  errResultFields: {
    reason: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (result) => result.asErr().reason,
    },
    code: {
      type: GraphQLNonNull(
        new GraphQLEnumType({
          name: 'SignInErrCodeType',
          values: {
            BUSINESS_ERROR: { value: 'BUSINESS_ERROR' },
          },
        }),
      ),
      resolve: (result) => {
        const err = result.asErr()
        if (err instanceof BusinessError) return 'BUSINESS_ERROR'
        throw new Error('Err is instance of an unexpected class')
      },
    },
  },
})
