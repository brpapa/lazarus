import debug from 'debug'
import { userRepo } from '../../infra/db/repositories'
import { UsersQuery } from './users-query'

const log = debug('app:user:application')

export { GetUserById } from './get-user-by-id'
export const usersQuery = new UsersQuery(log, userRepo)
