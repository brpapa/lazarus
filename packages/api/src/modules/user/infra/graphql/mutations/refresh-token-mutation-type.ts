import { createResultMutationType } from 'src/modules/shared/infra/graphql/create-mutation-type'
import { DateType } from 'src/modules/shared/infra/graphql/types/date-type'
import { UserNotFoundError } from 'src/modules/shared/logic/errors'
import { refreshTokenCommand } from 'src/modules/user/application/commands'
import {
  Input,
  RefreshTokenExpiredError,
  Res,
} from 'src/modules/user/application/commands/refresh-token-command'
import { GraphQLBoolean, GraphQLEnumType, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'

export const RefreshTokenMutationType = createResultMutationType<GraphQLContext, Input, Res>({
  name: 'RefreshToken',
  description: 'Login',
  inputFields: {
    refreshToken: { type: GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetResult: async (args, ctx) => refreshTokenCommand.exec(args, ctx),
  resultFields: {
    ok: {
      accessToken: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (res) => res.asOk().accessToken,
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
            name: 'RefreshTokenErrCodeType',
            values: {
              [RefreshTokenExpiredError.name]: { value: RefreshTokenExpiredError.name },
              [UserNotFoundError.name]: { value: UserNotFoundError.name },
            },
          }),
        ),
        resolve: (res) => res.asErr().code,
      },
    },
  },
})
