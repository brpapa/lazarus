import { GraphQLBoolean, GraphQLEnumType, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { signInCommand } from '@user/application/commands'
import {
  Input,
  Res,
  UserOrPasswordInvalidError,
} from '@user/application/commands/sign-in-command'
import { createMutationType } from '@shared/infra/graphql/create-mutation-type'
import { DateType } from '@shared/infra/graphql/types/date-type'

export const SignInMutationType = createMutationType<GraphQLContext, Input, Res>({
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
    reasonIsTranslated: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (result) => result.asErr().reasonIsTranslated,
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
      resolve: (result) => result.asErr().code,
    },
  },
})
