import { GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { createResultMutationType } from 'src/modules/shared/infra/graphql/create-result-mutation-type'
import { DateScalarType } from 'src/modules/shared/infra/graphql/types/date-scalar-type'
import { UserNotFoundError } from 'src/modules/shared/logic/errors'
import { refreshTokenCommand } from 'src/modules/user/application/commands'
import {
  Input,
  RefreshTokenExpiredError,
  Res,
} from 'src/modules/user/application/commands/refresh-token-command'

export const RefreshTokenMutationType = createResultMutationType<GraphQLContext, Input, Res>({
  name: 'RefreshToken',
  description: 'Login',
  inputFields: {
    refreshToken: { type: GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetResult: async (args, ctx) => refreshTokenCommand.exec(args, ctx),
  okFields: {
    accessToken: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (res) => res.asOk().accessToken,
    },
    accessTokenExpiresIn: {
      type: GraphQLNonNull(DateScalarType),
      description: 'The timestamp where the access token is no longer more valid',
      resolve: (res) => res.asOk().accessTokenExpiresIn,
    },
  },
  errors: [RefreshTokenExpiredError, UserNotFoundError],
})
