import { GraphQLError } from 'graphql'
import graphqlHttp from 'koa-graphql'
import { GraphQLContext } from 'src/infra/graphql/context'
import { createDataLoaders } from 'src/infra/graphql/loaders'
import { schema } from 'src/infra/graphql/schema'
import { getUserId } from 'src/infra/utils'
import { HTTP_GRAPHQL_FORCED_MIN_LATENCY_IN_MS, IS_PRODUCTION } from 'src/shared/config'

// build the graphql middleware, given a function that it'll be executed per request
export const graphqlHttpServer = graphqlHttp(async (koaReq) => {
  if (!IS_PRODUCTION)
    await new Promise((res) => setTimeout(res, HTTP_GRAPHQL_FORCED_MIN_LATENCY_IN_MS))

  const context: GraphQLContext = {
    userId: await getUserId(koaReq.header.authorization),
    request: koaReq.req,
    loaders: createDataLoaders(),
  }

  return {
    schema,
    context,
    formatError,
    pretty: true,
    graphiql: false,
  }
})

// graphql query mal-formated errors, etc
const formatError = (error: GraphQLError) => {
  return {
    message: error.message,
    locations: error.locations,
    stack: IS_PRODUCTION && error.stack ? error.stack.split('\n') : [],
    path: error.path,
  }
}
