import { GraphQLEnumType, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { refreshTokenCommand } from '@user/application/commands'
import {
  RefreshTokenInput,
  RefreshTokenResult,
} from '@user/application/commands/refresh-token-command'
import { createMutationType } from '@shared/infra/graphql/create-mutation-type'
import { DateType } from '@shared/infra/graphql/types/date-type'

export const RefreshTokenMutationType = createMutationType<
  GraphQLContext,
  RefreshTokenInput,
  RefreshTokenResult
>({
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
    code: {
      type: GraphQLNonNull(
        new GraphQLEnumType({
          name: 'RefreshTokenErrCodeType',
          values: {
            RefreshTokenExpiredError: { value: 'RefreshTokenExpiredError' },
            UserNotFoundError: { value: 'UserNotFoundError' },
          },
        }),
      ),
      resolve: (result) => result.asErr().code,
    },
  },
})
