import { GraphQLSchema } from 'graphql'

import { QueryRootType } from './root-types/query'
import { MutationRootType } from './root-types/mutation'
import { SubscriptionRootType } from './root-types/subscription'

export const schema: GraphQLSchema = new GraphQLSchema({
  query: QueryRootType,
  mutation: MutationRootType,
  subscription: SubscriptionRootType,
})
