import { GraphQLInterfaceType, GraphQLNonNull, GraphQLString } from 'graphql'
import { BaseError } from 'src/modules/shared/logic/errors'

export const ErrResultInterfaceType = new GraphQLInterfaceType({
  name: 'ErrResult',
  fields: {
    reason: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (error: BaseError) => error.reason,
    },
  },
})
