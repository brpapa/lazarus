import { err, okVoid, Result } from 'src/shared/logic/result/result'
import { Command } from 'src/shared/logic/command'
import { UnexpectedError, UseCaseError } from 'src/shared/logic/errors'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user-repo'
import { IAuthService } from 'src/modules/user/adapter/auth-service'
import { Debugger } from 'debug'

export type RefreshTokenInput = {
  refreshToken: string
}
export type RefreshTokenOutput = Result<void, UseCaseError | UnexpectedError>

export class RefreshAccessTokenCommand extends Command<RefreshTokenInput, RefreshTokenOutput> {
  constructor(log: Debugger, private userRepo: IUserRepo, private authService: IAuthService) {
    super(log)
  }

  async execImpl(req: RefreshTokenInput): Promise<RefreshTokenOutput> {
    try {
      const username = await this.authService.getUserNameFromRefreshToken(req.refreshToken)
      if (!username) return err(new UseCaseError('Refresh token expired'))

      const user = await this.userRepo.findByUsername(username)
      if (!user) return err(new UseCaseError('User not found'))

      const accessToken = this.authService.encodeJwt({
        userId: user.id.toString(),
        username: user.username,
      })
      user.setTokens(accessToken, req.refreshToken)

      await this.authService.commitAuthenticatedUser(user)
      return okVoid()
    } catch (e) {
      return err(new UnexpectedError(e))
    }
  }
}