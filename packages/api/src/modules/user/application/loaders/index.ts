import { userRepo } from '../../infra/db/repositories'
import { UserLoaderFactory } from './user-loader-factory'

export const userLoaderFactory = new UserLoaderFactory(userRepo)
