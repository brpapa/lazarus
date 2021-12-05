import { GraphQLFieldConfig } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'

// TODO: seguir relay specs: https://github.com/graphql/graphql-relay-js#mutations
export const userMutationsFields: Record<string, GraphQLFieldConfig<void, GraphQLContext>> = {
  // changeUserPassword,
  // userLoginWithEmail,
  // registerUserWithEmail,
}
