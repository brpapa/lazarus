import debug from 'debug'
import { userRepo } from '@user/infra/db/repositories'
import { authService } from '@user/application/services'
import { RefreshTokenCommand } from './refresh-token-command'
import { SignInCommand } from './sign-in-command'
import { SignOutCommand } from './sign-out-command'
import { SignUpCommand } from './sign-up-command'
import { UpdateUserLocationCommand } from './update-user-location-command'

const log = debug('app:user:application')

export const signUpCommand = new SignUpCommand(log, userRepo)
export const signInCommand = new SignInCommand(log, userRepo, authService)
export const signOutCommand = new SignOutCommand(log, userRepo, authService)
export const refreshTokenCommand = new RefreshTokenCommand(log, userRepo, authService)
export const updateUserLocationCommand = new UpdateUserLocationCommand(log, userRepo)
