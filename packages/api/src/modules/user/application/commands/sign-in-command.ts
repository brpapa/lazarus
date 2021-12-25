import { DomainEvents } from 'src/shared/domain/events/domain-events'
import { err, ok, Result } from 'src/shared/logic/result/result'
import { Command } from 'src/shared/logic/command'
import { ApplicationError } from 'src/shared/logic/errors'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user-repo'
import { IAuthService } from 'src/modules/user/adapter/auth-service'
import { Debugger } from 'debug'
import { unixEpochtoDate } from 'src/shared/logic/helpers/unix-epoch'
import assert from 'assert'

export type SignInInput = {
  username: string
  password: string
}
export type SignInOkResult = {
  accessToken: string
  accessTokenExpiresIn: Date
  refreshToken: string
}
export type SignInErrResult = UserOrPasswordInvalidError
export type SignInResult = Result<SignInOkResult, SignInErrResult>

/** login user */
export class SignInCommand extends Command<SignInInput, SignInResult> {
  constructor(log: Debugger, private userRepo: IUserRepo, private authService: IAuthService) {
    super(log)
  }

  async execImpl(input: SignInInput): Promise<SignInResult> {
    const user = await this.userRepo.findByUsername(input.username)
    if (!user) return err(new UserOrPasswordInvalidError())

    const passwordMatched = await user.password.compareAgainstPlainText(input.password)
    if (!passwordMatched) return err(new UserOrPasswordInvalidError())

    const accessToken = this.authService.encodeJwt({
      userId: user.id.toString(),
      username: user.username,
    })
    const refreshToken = this.authService.genRefreshToken()
    user.setTokens(accessToken, refreshToken)

    await this.authService.commitAuthenticatedUser(user)

    const jwtClaims = await this.authService.decodeJwt(accessToken)
    assert(jwtClaims !== null)
    const accessTokenExpiresIn = unixEpochtoDate(jwtClaims.exp)

    await DomainEvents.dispatchAllPendingEventsOfAggregate(user.id)

    return ok({ accessToken, refreshToken, accessTokenExpiresIn })
  }
}

export class UserOrPasswordInvalidError extends ApplicationError {
  constructor() {
    super('User or password invalid')
  }
}
