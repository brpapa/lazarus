import graphqlHttp from 'koa-graphql'
import { GraphQLError } from 'graphql'
import { schema } from '../../schema'
import { getUser } from '../../auth'
import * as loaders from '../../schema/loaders'
import type { Loaders } from '../../../lib/gql/node'
import { nodeEnv } from '../../../config'

const graphqlHttpServer = graphqlHttp(async (req) => {
  // graphql options per request (caching, batching)
  const { user } = await getUser(req.header.authorization)

  // @ts-ignore
  const allLoaders: Loaders = loaders

  return {
    schema,
    ctx: {
      user,
      req,
      dataloaders: Object.keys(allLoaders).reduce(
        (acc, loaderKey) => ({
          ...acc,
          [loaderKey]: allLoaders[loaderKey].getLoader(),
        }),
        {},
      ),
    },
    graphiql: nodeEnv !== 'production',
    formatError: (error: GraphQLError) => ({
      message: error.message,
      locations: error.locations,
      stack: nodeEnv !== 'production' && error.stack ? error.stack.split('\n') : [],
      path: error.path,
    }),
  }
})

export default graphqlHttpServer
