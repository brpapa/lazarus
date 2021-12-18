import { GraphQLFieldConfig } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { SignUpMutationType } from './sign-up-mutation-type'

export const userMutationsFields: Record<string, GraphQLFieldConfig<void, GraphQLContext>> = {
  registerUser: SignUpMutationType,
}
