import { err, okVoid, Result } from 'src/shared/logic/result/result'
import { Command } from 'src/shared/logic/command'
import { UnexpectedError, UseCaseError } from 'src/shared/logic/errors'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user-repo'
import { IAuthService } from 'src/modules/user/adapter/auth-service'
import { Debugger } from 'debug'

export type SignOutInput = {
  userId: string
}
export type SignOutOutput = Result<void, UseCaseError | UnexpectedError>

export class SignOutCommand extends Command<SignOutInput, SignOutOutput> {
  constructor(log: Debugger, private userRepo: IUserRepo, private authService: IAuthService) {
    super(log)
  }

  async execImpl(req: SignOutInput): Promise<SignOutOutput> {
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
