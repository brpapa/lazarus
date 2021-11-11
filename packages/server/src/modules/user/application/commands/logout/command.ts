import { err, okVoid, Result } from 'src/shared/logic/result/result'
import { Command } from 'src/shared/logic/command'
import { UnexpectedError, UseCaseError } from 'src/shared/logic/errors'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user'
import { IAuthService } from 'src/modules/user/adapter/auth-service'

export type Request = {
  userId: string
}
export type OkResponse = void
export type ErrResponse = UseCaseError | UnexpectedError
export type Response = Result<OkResponse, ErrResponse>

export class LogoutCommand implements Command<Request, Response> {
  constructor(private userRepo: IUserRepo, private authService: IAuthService) {}

  async exec(req: Request): Promise<Response> {
    try {
      const user = await this.userRepo.findById(req.userId)
      if (!user) return err(new UseCaseError('User not found'))

      await this.authService.unauthenticateUser(user.username)
      return okVoid()
    } catch (e) {
      return err(new UnexpectedError(e))
    }
  }
}
