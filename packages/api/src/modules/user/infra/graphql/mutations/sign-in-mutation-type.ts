import { GraphQLBoolean, GraphQLEnumType, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { signInCommand } from 'src/modules/user/application/commands'
import { Input, Res, UserOrPasswordInvalidError } from 'src/modules/user/application/commands/sign-in-command'
import { createResultMutationType } from 'src/modules/shared/infra/graphql/create-mutation-type'
import { DateType } from 'src/modules/shared/infra/graphql/types/date-type'

export const SignInMutationType = createResultMutationType<GraphQLContext, Input, Res>({
  name: 'SignIn',
  description: 'Login',
  inputFields: {
    username: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    pushToken: { type: GraphQLString },
  },
  mutateAndGetResult: async (args, ctx) => signInCommand.exec(args, ctx),
  resultFields: {
    ok: {
      accessToken: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (res) => res.asOk().accessToken,
      },
      refreshToken: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (res) => res.asOk().refreshToken,
      },
      accessTokenExpiresIn: {
        type: GraphQLNonNull(DateType),
        description: 'The timestamp where the access token is no longer more valid',
        resolve: (res) => res.asOk().accessTokenExpiresIn,
      },
    },
    err: {
      reason: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (res) => res.asErr().reason,
      },
      reasonIsTranslated: {
        type: GraphQLNonNull(GraphQLBoolean),
        resolve: (res) => res.asErr().reasonIsTranslated,
      },
      code: {
        type: GraphQLNonNull(
          new GraphQLEnumType({
            name: 'SignInErrCodeType',
            values: {
              [UserOrPasswordInvalidError.name]: { value: UserOrPasswordInvalidError.name },
            },
          }),
        ),
        resolve: (res) => res.asErr().code,
      },
    },
  },
})
