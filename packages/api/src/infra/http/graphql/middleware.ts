import graphqlHttp from 'koa-graphql'
import { GraphQLError } from 'graphql'
import { schema } from 'src/infra/http/graphql/schema'
import {
  HTTP_GRAPHQL_SUBSCRIPTIONS_PATH,
  IS_PRODUCTION,
  HTTP_PORT,
  HTTP_GRAPHQL_FORCED_MIN_LATENCY_IN_MS,
} from 'src/shared/config'
import { createDataLoaders } from 'src/infra/http/graphql/loaders'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { authService } from 'src/modules/user/services'
import { User } from 'src/modules/user/domain/models/user'
import { userRepo } from 'src/modules/user/infra/db/repositories'
import debug from 'debug'
import { IncomingHttpHeaders } from 'http'

const log = debug('app:infra:http:graphql')

// build the graphql middleware, given a function that it'll be executed per request
export const graphqlHttpServer = graphqlHttp(async (req, _res, _koaCtx) => {
  if (!IS_PRODUCTION)
    await new Promise((res) => setTimeout(res, HTTP_GRAPHQL_FORCED_MIN_LATENCY_IN_MS))

  const context: GraphQLContext = {
    viewer: await getViewer(req.header),
    req,
    loaders: createDataLoaders(),
  }

  return {
    schema,
    context,
    graphiql: IS_PRODUCTION
      ? false
      : ({
          subscriptionEndpoint: `ws://localhost:${HTTP_PORT}${HTTP_GRAPHQL_SUBSCRIPTIONS_PATH}`,
        } as any),
    formatError,
    pretty: true,
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

const getViewer = async (headers: IncomingHttpHeaders): Promise<User | null> => {
  const { authorization } = headers
  if (authorization) {
    const token = authorization.replace('Bearer ', '').trim()

    const decodedToken = await authService.decodeJwt(token)
    if (!decodedToken) {
      log('The received access token is expired or invalid')
      return null
    }

    const user = await userRepo.findById(decodedToken.userId)
    if (!user) {
      log(`User ${decodedToken.userId} no exists more`)
      return null
    }

    return user
  }
  return null
}
