import assert from 'assert'
import { Debugger } from 'debug'
import { IAuthService } from 'src/modules/user/adapter/auth-service'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user-repo'
import { Command } from 'src/modules/shared/logic/command'
import { ApplicationError, UserNotFoundError } from 'src/modules/shared/logic/errors'
import { unixEpochToDate } from 'src/modules/shared/logic/helpers/unix-epoch'
import { err, ok, Result } from '@lazarus/shared'

export type Input = {
  refreshToken: string
}
export type OkRes = {
  accessToken: string
  accessTokenExpiresIn: Date
}
export type ErrRes = RefreshTokenExpiredError | UserNotFoundError
export type Res = Result<OkRes, ErrRes>

export class RefreshTokenCommand extends Command<Input, Res> {
  constructor(log: Debugger, private userRepo: IUserRepo, private authService: IAuthService) {
    super(log)
  }

  async execImpl(input: Input): Promise<Res> {
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
