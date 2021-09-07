import Dataloader from 'dataloader'
import { IUser } from './modules/user/user-model'

type Key = string

export type Dataloaders = {
  UserLoader: Dataloader<Key, IUser>
}

export type GraphQLContext = {
  user?: IUser
  dataloaders: Dataloaders
}
