import DataLoader from 'dataloader'
import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader'
import mongoose, { Types } from 'mongoose'
import { ConnectionArguments } from 'graphql-relay'
import UserModel, { IUser } from './user-model'
import { GraphQLContext } from '../../type-declarations'

type ObjectId = mongoose.Schema.Types.ObjectId

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

export const getLoader = () =>
  new DataLoader((ids: ReadonlyArray<string>) => mongooseLoader(UserModel, ids))

const viewerCanSee = () => true

export const loadUser = async (
  ctx: GraphQLContext,
  // eslint-disable-next-line @typescript-eslint/ban-types
  id: string | object | ObjectId,
): Promise<User | null> => {
  if (!id && typeof id !== 'string') return null

  let data
  try {
    data = await ctx.dataloaders.UserLoader.load(id as string)
  } catch (err) {
    return null
  }

  return viewerCanSee() ? new User(data, ctx) : null
}

export const clearCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId) =>
  dataloaders.UserLoader.clear(id.toString())

export const primeCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId, data: IUser) =>
  dataloaders.UserLoader.prime(id.toString(), data)

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
