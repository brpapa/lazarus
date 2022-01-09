import { GraphQLFloat, GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType } from 'graphql'
import { LocationDTO } from '@shared/adapter/dtos/location-dto'

export const LocationType = new GraphQLObjectType<LocationDTO>({
  name: 'Location',
  fields: () => ({
    latitude: {
      type: GraphQLNonNull(GraphQLFloat),
      resolve: (location) => location.latitude,
    },
    longitude: {
      type: GraphQLNonNull(GraphQLFloat),
      resolve: (location) => location.longitude,
    },
  }),
})

export const LocationInputType = new GraphQLInputObjectType({
  name: 'LocationInput',
  fields: () => ({
    latitude: {
      type: GraphQLNonNull(GraphQLFloat),
    },
    longitude: {
      type: GraphQLNonNull(GraphQLFloat),
    },
  }),
})
