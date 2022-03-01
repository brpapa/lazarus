import { LanguageEnum } from '@lazarus/shared'
import { GraphQLEnumType } from 'graphql'
import { mapObjectValues } from 'src/modules/shared/logic/helpers/map-object-values'

export const LanguageEnumType = new GraphQLEnumType({
  name: 'LanguageEnum',
  values: mapObjectValues(LanguageEnum, (v) => ({ value: v })),
})
