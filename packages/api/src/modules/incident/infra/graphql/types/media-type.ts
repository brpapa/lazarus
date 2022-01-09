import { GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import { MediaDTO } from '@incident/adapter/dtos/media-dto'

export const MediaType = new GraphQLObjectType<MediaDTO>({
  name: 'Media',
  fields: () => ({
    url: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (media) => media.url,
    },
  }),
})

export const MediaInputType = new GraphQLInputObjectType({
  name: 'MediaInput',
  fields: () => ({
    url: {
      type: GraphQLNonNull(GraphQLString),
      description: 'S3 url',
    },
  }),
})
