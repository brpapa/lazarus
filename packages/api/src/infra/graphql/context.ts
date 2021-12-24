import { IncomingMessage } from 'http'
import type { DataLoaders } from './loaders'

export type GraphQLContext = {
  /**
   * the user entity currently asking for data
   *
   * should be passed from resolvers to the bussiness layer, where permissions/authorization is implemented (viewer can see methods)
   */
  userId: string | null
  request: IncomingMessage
  /**
   * the same data loader instance is shared between all resolvers within one request lifetime
   */
  loaders: DataLoaders
}
