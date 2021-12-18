import { err, ok, Result } from 'src/shared/logic/result/result'
import { Command } from 'src/shared/logic/command'
import { UnexpectedError, UseCaseError } from 'src/shared/logic/errors'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user-repo'
import { IAuthService } from 'src/modules/user/adapter/auth-service'
import { Debugger } from 'debug'

export type SignInInput = {
  username: string
  password: string
}
export type SignInOkOutput = {
  accessToken: string
  refreshToken: string
}
export type SignInErrOutput = UseCaseError | UnexpectedError
export type SignInOutput = Result<SignInOkOutput, SignInErrOutput>

export class SignInCommand extends Command<SignInInput, SignInOutput> {
  constructor(log: Debugger, private userRepo: IUserRepo, private authService: IAuthService) {
    super(log)
  }

  async execImpl(input: SignInInput): Promise<SignInOutput> {
    try {
      const user = await this.userRepo.findByUsername(input.username)
      if (!user) return err(new UseCaseError('User not found'))

      const passwordMatched = await user.password.compareAgainstPlainText(input.password)
      if (!passwordMatched) return err(new UseCaseError('Password does not match'))

      const accessToken = this.authService.encodeJwt({
        userId: user.id.toString(),
        username: user.username,
      })
      const refreshToken = this.authService.genRefreshToken()
      user.setTokens(accessToken, refreshToken)

      await this.authService.commitAuthenticatedUser(user)
      return ok({ accessToken, refreshToken })
    } catch (e) {
      return err(new UnexpectedError(e))
    }
  }
}
