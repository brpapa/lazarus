import { userRepo } from '../../infra/db/repositories'
import { UserLoaderFactory } from './user-loader'

export const userLoaderFactory = new UserLoaderFactory(userRepo)
