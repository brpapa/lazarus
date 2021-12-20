import { GraphQLInterfaceType, GraphQLNonNull, GraphQLString } from 'graphql'
import { AppError } from 'src/shared/logic/errors'

export const ErrResultInterfaceType = new GraphQLInterfaceType({
  name: 'ErrResult',
  fields: {
    reason: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (error: AppError) => error.reason,
    },
  },
})
