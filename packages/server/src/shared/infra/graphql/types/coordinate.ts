import { GraphQLFloat, GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { CoordinateDTO } from 'src/shared/adapter/dtos/coordinate'

export const CoordinateType = new GraphQLObjectType<CoordinateDTO, GraphQLContext>({
  name: 'Coordinate',
  fields: () => ({
    latitude: {
      type: GraphQLNonNull(GraphQLFloat),
      resolve: (coord) => coord.latitude,
    },
    longitude: {
      type: GraphQLNonNull(GraphQLFloat),
      resolve: (coord) => coord.longitude,
    },
  }),
})

export const CoordinateInputType = new GraphQLInputObjectType({
  name: 'CoordinateInput',
  fields: () => ({
    latitude: {
      type: GraphQLNonNull(GraphQLFloat),
    },
    longitude: {
      type: GraphQLNonNull(GraphQLFloat),
    },
  }),
})
