import debug from 'debug'
import { userRepo } from 'src/modules/user/infra/db/repositories'
import { authService } from 'src/modules/user/services'
import { RefreshAccessTokenCommand } from './refresh-token-command'
import { SignInCommand } from './sign-in-command'
import { SignOutCommand } from './sign-out-command'
import { SignUpCommand } from './sign-up-command'

const log = debug('app:user:application')

export const signUpCommand = new SignUpCommand(log, userRepo)
export const signInCommand = new SignInCommand(log, userRepo, authService)
export const signOutCommand = new SignOutCommand(log, userRepo, authService)
export const refreshTokenCommand = new RefreshAccessTokenCommand(log, userRepo, authService)
