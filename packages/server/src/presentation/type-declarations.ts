import Dataloader from 'dataloader'
import { IUser } from 'src/modules/user/user-model'

type Key = string

export type DataLoaders = {
  UserLoader: Dataloader<Key, IUser>
}

export type GraphQLContext = {
  user?: IUser
  loaders: DataLoaders
}
