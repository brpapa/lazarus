import { GraphQLEnumType, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { signInCommand } from 'src/modules/user/application/commands'
import { SignInInput, SignInResult } from 'src/modules/user/application/commands/sign-in-command'
import { createMutationType } from 'src/modules/shared/infra/graphql/create-mutation-type'
import { DateType } from 'src/modules/shared/infra/graphql/types/date-type'

export const SignInMutationType = createMutationType<GraphQLContext, SignInInput, SignInResult>({
  name: 'SignIn',
  description: 'Login',
  inputFields: {
    username: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    pushToken: { type: GraphQLString },
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
    accessTokenExpiresIn: {
      type: GraphQLNonNull(DateType),
      description: 'The timestamp where the access token is no longer more valid',
      resolve: (result) => result.asOk().accessTokenExpiresIn,
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
