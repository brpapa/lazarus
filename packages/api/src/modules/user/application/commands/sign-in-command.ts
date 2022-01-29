import { DomainEvents } from '@shared/domain/events/domain-events'
import { err, ok, Result } from '@metis/shared'
import { Command } from '@shared/logic/command'
import { ApplicationError } from '@shared/logic/errors'
import { IUserRepo } from '@user/adapter/repositories/user-repo'
import { IAuthService } from '@user/adapter/auth-service'
import { Debugger } from 'debug'
import { unixEpochToDate } from '@shared/logic/helpers/unix-epoch'
import assert from 'assert'

export type Input = {
  username: string
  password: string
  pushToken?: string
}
export type OkRes = {
  accessToken: string
  accessTokenExpiresIn: Date
  refreshToken: string
}
export type ErrRes = UserOrPasswordInvalidError
export type Res = Result<OkRes, ErrRes>

/** login user and register device to receive push notifications */
export class SignInCommand extends Command<Input, Res> {
  constructor(log: Debugger, private userRepo: IUserRepo, private authService: IAuthService) {
    super(log)
  }

  async execImpl(input: Input): Promise<Res> {
    const user = await this.userRepo.findByUsername(input.username)
    if (!user) return err(new UserOrPasswordInvalidError())

    const passwordMatched = await user.password.compareAgainstPlainText(input.password)
    if (!passwordMatched) return err(new UserOrPasswordInvalidError())

    const accessToken = this.authService.encodeJwt({
      userId: user.id.toString(),
      username: user.username,
    })
    const refreshToken = this.authService.genRefreshToken()
    user.signIn(accessToken, refreshToken, input.pushToken)

    await this.authService.authenticateUser(user)

    const jwtClaims = await this.authService.decodeJwt(accessToken)
    assert(jwtClaims !== null)
    const accessTokenExpiresIn = unixEpochToDate(jwtClaims.exp)

    await DomainEvents.dispatchAllPendingEventsOfAggregate(user.id)

    return ok({ accessToken, accessTokenExpiresIn, refreshToken })
  }
}

export class UserOrPasswordInvalidError extends ApplicationError {}
