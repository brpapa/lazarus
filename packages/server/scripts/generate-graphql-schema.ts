import fs from 'fs'
import path from 'path'
import { graphql } from 'graphql'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { introspectionQuery, printSchema } from 'graphql/utilities'
import { schema } from 'src/infra/http/graphql/schema'

// Save JSON of full schema introspection for Babel Relay Plugin to use
async function saveFullSchema() {
  // graphql: takes a GraphQLSchema instance and a query, and then calls validate and execute
  // validate: ensures that a given query adheres to the API defined by a given GraphQLSchema instance
  // execute: given a GraphQLSchema instance and a query, invokes the resolvers of the query’s fields and creates a response according to the GraphQL specification - this only works if resolvers are part of a GraphQLSchema instance
  const result = await graphql(schema, introspectionQuery)

  if (result.errors) {
    console.error('ERROR introspecting schema: ', JSON.stringify(result.errors, null, 2))
  } else {
    fs.writeFileSync(path.join(__dirname, '../data/schema.json'), JSON.stringify(result, null, 2))
    process.exit(0)
  }
}

// Save user readable type system shorthand of schema
function saveUserReadableSchema() {
  const sdlSchema = printSchema(schema) // create the SDL representaion of the GraphQLSchema instance
  fs.writeFileSync(path.join(__dirname, '../data/schema.graphql'), sdlSchema)
}

saveFullSchema()
saveUserReadableSchema()
