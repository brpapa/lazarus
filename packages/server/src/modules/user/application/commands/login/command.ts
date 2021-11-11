import { err, ok, Result } from 'src/shared/logic/result/result'
import { Command } from 'src/shared/logic/command'
import { UnexpectedError, UseCaseError } from 'src/shared/logic/errors'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user'
import { IAuthService } from 'src/modules/user/adapter/auth-service'

export type Request = {
  username: string
  password: string
}
export type OkResponse = {
  accessToken: string
  refreshToken: string
}
export type ErrResponse = UseCaseError | UnexpectedError
export type Response = Result<OkResponse, ErrResponse>

export class LoginCommand implements Command<Request, Response> {
  constructor(private userRepo: IUserRepo, private authService: IAuthService) {}

  async exec(req: Request): Promise<Response> {
    try {
      const user = await this.userRepo.findByUsername(req.username)
      if (!user) return err(new UseCaseError('User not found'))

      const passwordMatched = await user.password.compareAgainstPlainText(req.password)
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
