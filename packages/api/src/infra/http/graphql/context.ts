import { Request } from 'koa'
import { User } from 'src/modules/user/domain/models/user'
import type { DataLoaders } from './loaders'

export type GraphQLContext = {
  /**
   * the user entity currently asking for data
   *
   * should be passed from resolvers to the bussiness layer, where permissions/authorization is implemented (viewer can see methods)
   */
  viewer?: User
  req: Request
  /**
   * the same data loader instance is shared between all resolvers within one request lifetime
   */
  loaders: DataLoaders
}
