import { UserRepo } from 'src/modules/user/infra/db/user-repo'
import { CreateUserCommand } from './command'

const userRepo = new UserRepo()
export const createUserCommand = new CreateUserCommand(userRepo)

export * as CreateUserErrors from './errors'
