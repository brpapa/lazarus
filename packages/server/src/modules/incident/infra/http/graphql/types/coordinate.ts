import { GraphQLContext } from 'src/infra/http/graphql/context'
import { GraphQLObjectType, GraphQLString } from 'graphql'
import { CoordinateDTO } from 'src/modules/incident/adapter/dtos/coordinate'

export const CoordinateType = new GraphQLObjectType<CoordinateDTO, GraphQLContext>({
  name: 'Coordinate',
  fields: () => ({
    latitude: {
      type: GraphQLString,
      resolve: (coordinate) => coordinate.latitude,
    },
    longitude: {
      type: GraphQLString,
      resolve: (coordinate) => coordinate.longitude,
    },
  }),
})
