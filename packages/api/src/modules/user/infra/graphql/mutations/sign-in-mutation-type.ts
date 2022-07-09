import { GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { createResultMutationType } from 'src/modules/shared/infra/graphql/create-result-mutation-type'
import { DateScalarType } from 'src/modules/shared/infra/graphql/types/date-scalar-type'
import { signInCommand } from 'src/modules/user/application/commands'
import {
  Input,
  Res,
  UserOrPasswordInvalidError,
} from 'src/modules/user/application/commands/sign-in-command'

export const SignInMutationType = createResultMutationType<GraphQLContext, Input, Res>({
  name: 'SignIn',
  description: 'Login',
  inputFields: {
    username: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    pushToken: { type: GraphQLString },
  },
  mutateAndGetResult: async (args, ctx) => signInCommand.exec(args, ctx),
  okFields: {
    accessToken: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (res) => res.asOk().accessToken,
    },
    refreshToken: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (res) => res.asOk().refreshToken,
    },
    accessTokenExpiresIn: {
      type: GraphQLNonNull(DateScalarType),
      description: 'The timestamp when the access token is no longer valid',
      resolve: (res) => res.asOk().accessTokenExpiresIn,
    },
  },
  errors: [UserOrPasswordInvalidError],
})
