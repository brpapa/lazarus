import { createMutationType } from '@shared/infra/graphql/create-mutation-type'
import { DateType } from '@shared/infra/graphql/types/date-type'
import { refreshTokenCommand } from '@user/application/commands'
import {
  RefreshTokenExpiredError,
  Input,
  Res,
} from '@user/application/commands/refresh-token-command'
import { GraphQLBoolean, GraphQLEnumType, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { UserNotFoundError } from 'src/modules/shared/logic/errors'

export const RefreshTokenMutationType = createMutationType<GraphQLContext, Input, Res>({
  name: 'RefreshToken',
  description: 'Login',
  inputFields: {
    refreshToken: { type: GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetResult: async (args, ctx) => refreshTokenCommand.exec(args, ctx),
  okResultFields: {
    accessToken: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (result) => result.asOk().accessToken,
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
          name: 'RefreshTokenErrCodeType',
          values: {
            [RefreshTokenExpiredError.name]: { value: RefreshTokenExpiredError.name },
            [UserNotFoundError.name]: { value: UserNotFoundError.name },
          },
        }),
      ),
      resolve: (result) => result.asErr().code,
    },
  },
})
