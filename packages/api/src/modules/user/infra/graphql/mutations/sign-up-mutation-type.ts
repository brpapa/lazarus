import { GraphQLEnumType, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { signUpCommand } from '@user/application/commands'
import { SignUpInput, SignUpResult } from '@user/application/commands/sign-up-command'
import { GetUserById } from '@user/application/queries/get-user-by-id'
import { createMutationType } from '@shared/infra/graphql/create-mutation-type'
import { UserType } from '../types/user-type'

export const SignUpMutationType = createMutationType<GraphQLContext, SignUpInput, SignUpResult>({
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
    code: {
      type: GraphQLNonNull(
        new GraphQLEnumType({
          name: 'SignUpErrCodeType',
          values: {
            PasswordSizeError: { value: 'PasswordSizeError' },
            InvalidPhoneNumberError: { value: 'InvalidPhoneNumberError' },
          },
        }),
      ),
      resolve: (result) => result.asErr().code,
    },
  },
})
