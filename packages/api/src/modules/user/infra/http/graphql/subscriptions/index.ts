import { GraphQLFieldConfig } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { UserAddedSubscriptionType } from './user-added-subscription-type'

export const userSubscriptionsFields: Record<string, GraphQLFieldConfig<void, GraphQLContext>> = {
  userAdded: UserAddedSubscriptionType,
}
