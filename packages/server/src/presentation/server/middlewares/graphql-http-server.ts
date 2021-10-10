import graphqlHttp from 'koa-graphql'
import { GraphQLError } from 'graphql'
import { schema } from '../../schema'
import { getUser } from '../../auth'
import { nodeEnv } from '../../../config'
import loaders from '../../schema/loaders'
import { GraphQLContext } from '../../type-declarations'

// build the graphql middleware, passing a function that it'll be executed for each request
const graphqlHttpServer = graphqlHttp(async (req) => {
  const { user } = await getUser(req.header.authorization)

  return {
    schema,
    ctx: {
      user,
      req,
      // DataLoader is a pattern to optimize graphql requests, like these that contains a circular reference and require the same data multiple times, for example (user -> article -> comments -> writtenByUser (can be the same that wrote the article)). The idea is that resolver calls are batched and thus the data source (database or external APIs) only has to be hit once, avoiding round-trips.
      // DataLoader will coalesce all individual loads which occur within a single frame of execution (a single tick of the event loop) and then call the batch loading function with all the requested keys
      loaders: {
        UserLoader: loaders.UserLoader.createLoader(), // instances of all DataLoader classes are created per request (to enable caching and batching)
      },
    } as GraphQLContext,
    formatError: (error: GraphQLError) => ({
      message: error.message,
      locations: error.locations,
      stack: nodeEnv !== 'production' && error.stack ? error.stack.split('\n') : [],
      path: error.path,
    }),
    graphiql: nodeEnv !== 'production',
  }
})

export default graphqlHttpServer
