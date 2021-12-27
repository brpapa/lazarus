import fs from 'fs'
import path from 'path'
import { graphql } from 'graphql'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { introspectionQuery, printSchema } from 'graphql/utilities'
import { schema } from 'src/api/graphql/schema'
import debug from 'debug'

const log = debug('app:scripts')

const pathRelativeToGraphQLDir = path.join.bind(this, __dirname, '..', 'graphql')

// Save JSON of full schema introspection for Babel Relay Plugin to use
async function saveFullSchema() {
  // graphql: given a GraphQLSchema instance and a query, calls the `validate` and `execute` methods
  // validate: ensures that a given query adheres to the API defined by a given GraphQLSchema instance
  // execute: given a GraphQLSchema instance and a query, invokes the resolvers of the query’s fields and creates a response according to the GraphQL specification - this only works if resolvers are part of a GraphQLSchema instance
  const result = await graphql(schema, introspectionQuery)

  if (result.errors) {
    log('error introspecting schema: %s', result.errors)
  } else {
    fs.writeFileSync(pathRelativeToGraphQLDir('schema.json'), JSON.stringify(result, null, 2))
    process.exit(0)
  }
}

// Save user readable type system shorthand of schema
function saveSDLSchema() {
  const sdlSchema = printSchema(schema)
  fs.writeFileSync(pathRelativeToGraphQLDir('schema.graphql'), sdlSchema)
  log('SDL generated')
}

// saveFullSchema()
saveSDLSchema()
