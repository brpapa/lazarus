import debug from 'debug'
import { GraphQLError } from 'graphql'
import graphqlHttp from 'koa-graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { createDataLoaders } from 'src/api/graphql/loaders'
import { schema } from 'src/api/graphql/schema'
import { getUserId } from 'src/api/utils'
import { HTTP_GRAPHQL_FORCED_MIN_LATENCY_ON_DEV_IN_MS, IS_PRODUCTION } from 'src/config'

const log = debug('app:infra:http')

// build the graphql middleware, given a function that it'll be executed per request
export const graphqlHttpServer = graphqlHttp(async (koaReq) => {
  if (!IS_PRODUCTION)
    await new Promise((res) => setTimeout(res, HTTP_GRAPHQL_FORCED_MIN_LATENCY_ON_DEV_IN_MS))

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
  log('[error] GraphQL resolver throws the error: %O', error)
  return {
    message: error.message,
    locations: error.locations,
    stack: IS_PRODUCTION && error.stack ? error.stack.split('\n') : [],
    path: error.path,
  }
}
