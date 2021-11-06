import { GraphQLFieldConfig } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import UserAdded from './user-added'

export const userSubscriptionFields: Record<string, GraphQLFieldConfig<void, GraphQLContext>> = {
  UserAdded,
}
