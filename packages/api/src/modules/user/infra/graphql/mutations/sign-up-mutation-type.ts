import { GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { createResultMutationType } from 'src/modules/shared/infra/graphql/create-result-mutation-type'
import { signUpCommand } from 'src/modules/user/application/commands'
import {
  EmailTakenError,
  Input,
  Res,
  UsernameTakenError,
} from 'src/modules/user/application/commands/sign-up-command'
import { GetUserById } from 'src/modules/user/application/queries/get-user-by-id'
import { InvalidEmailAddressError } from 'src/modules/user/domain/models/user-email'
import { ShortPasswordError } from 'src/modules/user/domain/models/user-password'
import { UserType } from '../types/user-type'

export const SignUpMutationType = createResultMutationType<GraphQLContext, Input, Res>({
  name: 'SignUp',
  description: 'Register a new user',
  inputFields: {
    username: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetResult: async (args, ctx) => signUpCommand.exec({ ...args }, ctx),
  okFields: {
    user: {
      type: GraphQLNonNull(UserType),
      resolve: (res, _, ctx) => GetUserById.gen(res.asOk(), ctx),
    },
  },
  errors: [ShortPasswordError, InvalidEmailAddressError, UsernameTakenError, EmailTakenError],
})
