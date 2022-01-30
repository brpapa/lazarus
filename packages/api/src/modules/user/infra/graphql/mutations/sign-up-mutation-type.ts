import { createMutationType } from '@shared/infra/graphql/create-mutation-type'
import { signUpCommand } from '@user/application/commands'
import {
  EmailTakenError,
  Input,
  Res,
  UsernameTakenError,
} from '@user/application/commands/sign-up-command'
import { GetUserById } from '@user/application/queries/get-user-by-id'
import { ShortPasswordError } from '@user/domain/models/user-password'
import { GraphQLBoolean, GraphQLEnumType, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { InvalidEmailAddressError } from 'src/modules/user/domain/models/user-email'
import { UserType } from '../types/user-type'

export const SignUpMutationType = createMutationType<GraphQLContext, Input, Res>({
  name: 'SignUp',
  description: 'Register a new user',
  inputFields: {
    username: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetResult: async (args, ctx) => signUpCommand.exec({ ...args }, ctx),
  okResultFields: {
    user: {
      type: GraphQLNonNull(UserType),
      resolve: (result, _, ctx) => GetUserById.gen(result.asOk(), ctx),
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
          name: 'SignUpErrCodeType',
          values: {
            [ShortPasswordError.name]: { value: ShortPasswordError.name },
            [InvalidEmailAddressError.name]: { value: InvalidEmailAddressError.name },
            [UsernameTakenError.name]: { value: UsernameTakenError.name },
            [EmailTakenError.name]: { value: EmailTakenError.name },
          },
        }),
      ),
      resolve: (result) => result.asErr().code,
    },
  },
})
