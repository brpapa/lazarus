import { Debugger } from 'debug'
import { Command } from '@shared/logic/command'
import { UserNotFoundError } from '@shared/logic/errors'
import { err, okVoid, Result } from '@shared/logic/result/result'
import { IAuthService } from '@user/adapter/auth-service'
import { IUserRepo } from '@user/adapter/repositories/user-repo'

export type SignOutInput = {
  userId: string
}
export type SignOutOutput = Result<void, UserNotFoundError>

export class SignOutCommand extends Command<SignOutInput, SignOutOutput> {
  constructor(log: Debugger, private userRepo: IUserRepo, private authService: IAuthService) {
    super(log)
  }

  async execImpl(req: SignOutInput): Promise<SignOutOutput> {
    const user = await this.userRepo.findById(req.userId)
    if (!user) return err(new UserNotFoundError())

    await this.authService.unauthenticateUser(user.username)
    return okVoid()
  }
}
