import { GraphQLScalarType, Kind, GraphQLError } from 'graphql'

export const DateType = new GraphQLScalarType({
  name: 'Date',
  description: 'Date type serialized into ISO string',
  /**
   * @param value comes from client in variables
   * @returns value sent to the resolvers
   */
  parseValue: (value) => {
    ensureValueIsValid(value)
    return new Date(value)
  },
  /**
   * @param ast comes from client inlined in the query
   * @returns value sent to the resolvers
   */
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.STRING)
      throw new GraphQLError(`Query error: can only parse strings to date, got a ${ast.kind}`, [
        ast,
      ])
    ensureValueIsValid(ast.value)
    return new Date(ast.value)
  },
  /**
   * @param value comes from resolvers
   * @returns value sent to the client
   */
  serialize: (value: Date) => {
    return value.toISOString()
  },
})

const ensureValueIsValid = (value: any) => {
  if (Number.isNaN(Date.parse(value)))
    throw new GraphQLError('Query error: not a valid date', [value])
}
