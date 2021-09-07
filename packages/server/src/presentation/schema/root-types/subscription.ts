import { GraphQLObjectType } from 'graphql'
import UserSubscriptions from '../../modules/user/subscriptions'

export const SubscriptionRootType = new GraphQLObjectType({
  name: 'Subscription',
  description: 'The root of all subscriptions',
  fields: {
    ...UserSubscriptions,
  },
})
