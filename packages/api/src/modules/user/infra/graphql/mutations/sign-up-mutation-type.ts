import { createMutationType } from '@shared/infra/graphql/create-mutation-type'
import { signUpCommand } from '@user/application/commands'
import { Input, Res } from '@user/application/commands/sign-up-command'
import { GetUserById } from '@user/application/queries/get-user-by-id'
import { GraphQLBoolean, GraphQLEnumType, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { ShortPasswordError } from 'src/modules/user/domain/models/user-password'
import { InvalidPhoneNumberError } from 'src/modules/user/domain/models/user-phone-number'
import { UserType } from '../types/user-type'

export const SignUpMutationType = createMutationType<GraphQLContext, Input, Res>({
  name: 'SignUp',
  description: 'Register a new user',
  inputFields: {
    username: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    phoneNumber: { type: GraphQLString },
  },
  mutateAndGetResult: async (args, ctx) =>
    signUpCommand.exec(
      { ...args, phoneNumber: '14999999' }, // TODO
      ctx,
    ),
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
            [InvalidPhoneNumberError.name]: { value: InvalidPhoneNumberError.name },
          },
        }),
      ),
      resolve: (result) => result.asErr().code,
    },
  },
})
