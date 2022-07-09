import { MediaDTO } from 'src/modules/incident/adapter/dtos/media-dto'
import { mapObjectValues } from 'src/modules/shared/logic/helpers/map-object-values'
import {
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import { MediaTypeEnum } from 'src/modules/incident/domain/models/media-type'

const MediaTypeEnumType = new GraphQLEnumType({
  name: 'MediaTypeEnum',
  values: mapObjectValues(MediaTypeEnum, (v) => ({ value: v })),
})

export const MediaType = new GraphQLObjectType<MediaDTO>({
  name: 'Media',
  fields: () => ({
    url: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (media) => media.url,
    },
    type: {
      type: GraphQLNonNull(MediaTypeEnumType),
      resolve: (media) => media.type,
    },
  }),
})

export const MediaInputType = new GraphQLInputObjectType({
  name: 'MediaInput',
  fields: () => ({
    url: {
      type: GraphQLNonNull(GraphQLString),
    },
    type: {
      type: GraphQLNonNull(MediaTypeEnumType),
    },
  }),
})
