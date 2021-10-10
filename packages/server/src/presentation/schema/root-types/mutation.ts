import { GraphQLObjectType } from 'graphql'
import userMutations from '../../../modules/user/mutations'

export const MutationRootType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'The root of all mutations',
  fields: () => ({
    ...userMutations,
  }),
})
