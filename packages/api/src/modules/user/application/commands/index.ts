import debug from 'debug'
import { userRepo } from 'src/modules/user/infra/db/repositories'
import { authService } from 'src/modules/user/services'
import { LoginCommand } from './login/command'
import { LogoutCommand } from './logout/command'
import { RefreshAccessToken } from './refresh-access-token/command'
import { RegisterUserCommand } from './register-user/command'

const log = debug('app:user:application')

export const createUserCommand = new RegisterUserCommand(log, userRepo)
export const loginCommand = new LoginCommand(log, userRepo, authService)
export const logoutCommand = new LogoutCommand(log, userRepo, authService)
export const refreshAccesToken = new RefreshAccessToken(log, userRepo, authService)
