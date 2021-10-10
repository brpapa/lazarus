import DataLoader, { BatchLoadFn } from 'dataloader'
import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader'
import mongoose, { Types } from 'mongoose'
import { ConnectionArguments } from 'graphql-relay'
import UserModel, { IUser } from './user-model'
import { GraphQLContext } from '../../presentation/type-declarations'

export default class User {
  public id: string
  public _id: Types.ObjectId
  public name: string
  public email: string | null | undefined
  public active: boolean | null | undefined

  constructor(data: IUser, { user }: GraphQLContext) {
    this.id = data._id
    this._id = data._id
    this.name = data.name

    // you can only see your own email, and your active status
    if (user && user._id.equals(data._id)) {
      this.email = data.email
      this.active = data.active
    }
  }
}

// batch loading function (load many users at once)
const batchGetUsers: BatchLoadFn<string, IUser> = (ids) => mongooseLoader(UserModel, ids)

// sqlite3
// const batchGetUsers: BatchLoadFn<string, User> = (ids) => {
//   db.all('SELECT * FROM users WHERE id IN $ids', { $ids: ids }, (error, rows) => {
//     if (error) {
//       reject(error)
//     } else {
//       // each index in the array of returned values must correspond to the same index in the array of received keys
//       resolve(
//         ids.map((id) => rows.find((row) => row.id === id) || new Error(`Row not found: ${id}`)),
//       )
//     }
//   })
// }

export const createLoader = () => new DataLoader(batchGetUsers) // the .load() of created instance is a memoized function (in-memory only)

const viewerCanSee = () => true

export const loadUser = async (
  ctx: GraphQLContext,
  // eslint-disable-next-line @typescript-eslint/ban-types
  id: string | object | mongoose.Schema.Types.ObjectId,
): Promise<User | null> => {
  if (!id && typeof id !== 'string') return null

  let data
  try {
    // ctx.loaders.UserLoader is equivalent to createLoader() above
    data = await ctx.loaders.UserLoader.load(id as string)
  } catch (err) {
    return null
  }

  return viewerCanSee() ? new User(data, ctx) : null
}

export const clearCache = ({ loaders }: GraphQLContext, id: Types.ObjectId) =>
  loaders.UserLoader.clear(id.toString())

export const primeCache = ({ loaders }: GraphQLContext, id: Types.ObjectId, data: IUser) =>
  loaders.UserLoader.prime(id.toString(), data)

export const clearAndPrimeCache = (ctx: GraphQLContext, id: Types.ObjectId, data: IUser) =>
  clearCache(ctx, id) && primeCache(ctx, id, data)

export type UserArgs = ConnectionArguments & {
  search?: string
}
export const loadUsers = async (ctx: GraphQLContext, args: UserArgs) => {
  const where = args.search ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } } : {}
  const users = UserModel.find(where, { _id: 1 }).sort({ createdAt: -1 })

  return connectionFromMongoCursor({
    cursor: users,
    context: ctx,
    args,
    loader: loadUser,
  })
}
