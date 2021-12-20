import { DomainEvents } from 'src/shared/domain/events/domain-events'
import { err, ok, Result } from 'src/shared/logic/result/result'
import { Command } from 'src/shared/logic/command'
import { BusinessError } from 'src/shared/logic/errors'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user-repo'
import { IAuthService } from 'src/modules/user/adapter/auth-service'
import { Debugger } from 'debug'

export type SignInInput = {
  username: string
  password: string
}
export type SignInOkResult = {
  accessToken: string
  refreshToken: string
}
export type SignInErrResult = BusinessError
export type SignInResult = Result<SignInOkResult, SignInErrResult>

/** login user */
export class SignInCommand extends Command<SignInInput, SignInResult> {
  constructor(log: Debugger, private userRepo: IUserRepo, private authService: IAuthService) {
    super(log)
  }

  async execImpl(input: SignInInput): Promise<SignInResult> {
    const user = await this.userRepo.findByUsername(input.username)
    if (!user) return err(new BusinessError('User not found'))

    const passwordMatched = await user.password.compareAgainstPlainText(input.password)
    if (!passwordMatched) return err(new BusinessError('Password does not match'))

    const accessToken = this.authService.encodeJwt({
      userId: user.id.toString(),
      username: user.username,
    })
    const refreshToken = this.authService.genRefreshToken()
    user.setTokens(accessToken, refreshToken)

    await this.authService.commitAuthenticatedUser(user)

    DomainEvents.dispatchAllPendingEventsOfAggregate(user.id)

    return ok({ accessToken, refreshToken })
  }
}
