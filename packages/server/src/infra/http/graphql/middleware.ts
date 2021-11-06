import graphqlHttp from 'koa-graphql'
import { GraphQLError } from 'graphql'
import { schema } from 'src/infra/http/graphql/schema'
import { getAuthenticatedUser } from 'src/infra/http/auth'
import { graphqlSubscriptionsPath, isProduction, httpPort } from 'src/shared/config'
import { createLoaders } from 'src/infra/http/graphql/loaders'
import { GraphQLContext } from 'src/infra/http/graphql/context'

// build the graphql middleware, given a function that it'll be executed per request
export const graphqlHttpServer = graphqlHttp(async (req, _res, _koaCtx) => {
  // const { user: viewer } = await getAuthenticatedUser(req.header.authorization)

  const context: GraphQLContext = {
    viewer: undefined,
    req,
    loaders: createLoaders(),
  }

  return {
    schema,
    context,
    graphiql: isProduction()
      ? false
      : ({
          subscriptionEndpoint: `ws://localhost:${httpPort}${graphqlSubscriptionsPath}`,
        } as any),
    formatError,
    pretty: true,
  }
})

const formatError = (error: GraphQLError) => ({
  message: error.message,
  coordinates: error.locations,
  stack: isProduction() && error.stack ? error.stack.split('\n') : [],
  path: error.path,
})
