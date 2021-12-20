import { GraphQLEnumType, GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { signUpCommand } from 'src/modules/user/application/commands'
import { SignUpInput, SignUpResult } from 'src/modules/user/application/commands/sign-up-command'
import { GetUserById } from 'src/modules/user/application/queries/get-user-by-id'
import { createMutationType } from 'src/shared/infra/graphql/create-mutation-type'
import { BusinessError, DomainError } from 'src/shared/logic/errors'
import { UserType } from '../types/user-type'

export const SignUpMutationType = createMutationType<GraphQLContext, SignUpInput, SignUpResult>({
  name: 'SignUp',
  inputFields: {
    username: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    phoneNumber: { type: GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetResult: async (args, ctx) => signUpCommand.exec(args, ctx),
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
            DOMAIN_ERROR: { value: 'DOMAIN_ERROR' },
            BUSINESS_ERROR: { value: 'BUSINESS_ERROR' },
          },
        }),
      ),
      resolve: (result) => {
        const err = result.asErr()
        if (err instanceof DomainError) return 'DOMAIN_ERROR'
        if (err instanceof BusinessError) return 'BUSINESS_ERROR'
        throw new Error('Err is instance of an unexpected class')
      },
    },
  },
})
