import { GraphQLEnumType, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/infra/graphql/context'
import { signInCommand } from 'src/modules/user/application/commands'
import {
  SignInInput,
  SignInResult,
  UserOrPasswordInvalidError,
} from 'src/modules/user/application/commands/sign-in-command'
import { createMutationType } from 'src/shared/infra/graphql/create-mutation-type'

export const SignInMutationType = createMutationType<GraphQLContext, SignInInput, SignInResult>({
  name: 'SignIn',
  description: 'Login',
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
            UserOrPasswordInvalidError: { value: 'UserOrPasswordInvalidError' },
          },
        }),
      ),
      resolve: (result) => result.asErr().code,
    },
  },
})
