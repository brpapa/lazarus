import { GraphQLFloat, GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType } from 'graphql'
import { CoordinateDTO } from 'src/shared/adapter/dtos/coordinate'

export const CoordinateType = new GraphQLObjectType<CoordinateDTO>({
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
