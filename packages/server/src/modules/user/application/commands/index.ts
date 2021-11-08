import { userRepo } from 'src/modules/user/infra/db/repositories'
import { authService } from 'src/modules/user/services'
import { RegisterUserCommand } from './register-user/command'
import { LoginCommand } from './login/command'
import { LogoutCommand } from './logout/command'
import { RefreshAccessToken } from './refresh-access-token/command'

export const createUserCommand = new RegisterUserCommand(userRepo)
export const loginCommand = new LoginCommand(userRepo, authService)
export const logoutCommand = new LogoutCommand(userRepo, authService)
export const refreshAccesToken = new RefreshAccessToken(userRepo, authService)
