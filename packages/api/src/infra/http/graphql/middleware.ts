import graphqlHttp from 'koa-graphql'
import { GraphQLError } from 'graphql'
import { schema } from 'src/infra/http/graphql/schema'
import { GRAPHQL_SUBSCRIPTIONS_PATH, IS_PRODUCTION, HTTP_PORT } from 'src/shared/config'
import { createLoaders } from 'src/infra/http/graphql/loaders'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { authService } from 'src/modules/user/services'
import { User } from 'src/modules/user/domain/models/user'
import { userRepo } from 'src/modules/user/infra/db/repositories'
import debug from 'debug'

const log = debug('app:infra:http')

// build the graphql middleware, given a function that it'll be executed per request
export const graphqlHttpServer = graphqlHttp(async (req, _res, _koaCtx) => {
  const context: GraphQLContext = {
    viewer: undefined,
    req,
    loaders: createLoaders(),
  }

  const { authorization } = req.header
  if (authorization) {
    const token = authorization.replace('Bearer ', '').trim()
    const user = await getAuthenticatedUser(token)
    context.viewer = user
  }

  return {
    schema,
    context,
    graphiql: IS_PRODUCTION
      ? false
      : ({
          subscriptionEndpoint: `ws://localhost:${HTTP_PORT}${GRAPHQL_SUBSCRIPTIONS_PATH}`,
        } as any),
    formatError,
    pretty: true,
  }
})

const formatError = (error: GraphQLError) => {
  log('GraphQL query error message: %o', error.message)
  return {
    message: error.message,
    coordinates: error.locations,
    stack: IS_PRODUCTION && error.stack ? error.stack.split('\n') : [],
    path: error.path,
  }
}

const getAuthenticatedUser = async (token: string): Promise<User> => {
  const decoded = await authService.decodeJwt(token)
  if (!decoded) throw new Error('Access token expired')
  const user = await userRepo.findById(decoded.userId)
  if (!user) throw new Error('User not found')
  return user
}
