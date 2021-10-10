import { GraphQLObjectType } from 'graphql'
import userSubscriptions from '../../../modules/user/subscriptions'

export const SubscriptionRootType = new GraphQLObjectType({
  name: 'Subscription',
  description: 'The root of all subscriptions',
  fields: {
    ...userSubscriptions,
  },
})
