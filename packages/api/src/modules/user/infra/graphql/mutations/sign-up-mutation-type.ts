import { createResultMutationType } from 'src/modules/shared/infra/graphql/create-mutation-type'
import { signUpCommand } from 'src/modules/user/application/commands'
import {
  EmailTakenError,
  Input,
  Res,
  UsernameTakenError,
} from 'src/modules/user/application/commands/sign-up-command'
import { GetUserById } from 'src/modules/user/application/queries/get-user-by-id'
import { ShortPasswordError } from 'src/modules/user/domain/models/user-password'
import { GraphQLBoolean, GraphQLEnumType, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { InvalidEmailAddressError } from 'src/modules/user/domain/models/user-email'
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
  resultFields: {
    ok: {
      user: {
        type: GraphQLNonNull(UserType),
        resolve: (res, _, ctx) => GetUserById.gen(res.asOk(), ctx),
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
  },
})
