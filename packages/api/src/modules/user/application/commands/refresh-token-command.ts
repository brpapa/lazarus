import assert from 'assert'
import { Debugger } from 'debug'
import { IAuthService } from '@user/adapter/auth-service'
import { IUserRepo } from '@user/adapter/repositories/user-repo'
import { Command } from '@shared/logic/command'
import { ApplicationError, UserNotFoundError } from '@shared/logic/errors'
import { unixEpochToDate } from '@shared/logic/helpers/unix-epoch'
import { err, ok, Result } from '@metis/shared'

export type RefreshTokenInput = {
  refreshToken: string
}
export type RefreshTokenOkResult = {
  accessToken: string
  accessTokenExpiresIn: Date
}
export type RefreshTokenErrResult = RefreshTokenExpiredError | UserNotFoundError
export type RefreshTokenResult = Result<RefreshTokenOkResult, RefreshTokenErrResult>

export class RefreshTokenCommand extends Command<RefreshTokenInput, RefreshTokenResult> {
  constructor(log: Debugger, private userRepo: IUserRepo, private authService: IAuthService) {
    super(log)
  }

  async execImpl(input: RefreshTokenInput): Promise<RefreshTokenResult> {
    const username = await this.authService.getUserNameFromRefreshToken(input.refreshToken)
    if (!username) return err(new RefreshTokenExpiredError())

    const user = await this.userRepo.findByUsername(username)
    if (!user) return err(new UserNotFoundError())

    const accessToken = this.authService.encodeJwt({
      userId: user.id.toString(),
      username: user.username,
    })
    user.signIn(accessToken, input.refreshToken)

    const jwtClaims = await this.authService.decodeJwt(accessToken)
    assert(jwtClaims !== null)
    const accessTokenExpiresIn = unixEpochToDate(jwtClaims.exp)

    await this.authService.authenticateUser(user)
    return ok({ accessToken, accessTokenExpiresIn })
  }
}

export class RefreshTokenExpiredError extends ApplicationError {
  constructor() {
    super(undefined, 'Refresh token expired')
  }
}
