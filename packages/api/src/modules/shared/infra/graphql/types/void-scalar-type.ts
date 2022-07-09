import { GraphQLScalarType } from 'graphql'

export const VoidScalarType = new GraphQLScalarType({
  name: 'Void',
  description: 'Represents NULL values',
  parseValue: () => null,
  parseLiteral: () => null,
  serialize: () => null,
})
