import { err, okVoid, Result } from 'src/shared/logic/result/result'
import { Command } from 'src/shared/logic/command'
import { BusinessError } from 'src/shared/logic/errors'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user-repo'
import { IAuthService } from 'src/modules/user/adapter/auth-service'
import { Debugger } from 'debug'

export type SignOutInput = {
  userId: string
}
export type SignOutOutput = Result<void, BusinessError>

export class SignOutCommand extends Command<SignOutInput, SignOutOutput> {
  constructor(log: Debugger, private userRepo: IUserRepo, private authService: IAuthService) {
    super(log)
  }

  async execImpl(req: SignOutInput): Promise<SignOutOutput> {
    const user = await this.userRepo.findById(req.userId)
    if (!user) return err(new BusinessError('User not found'))

    await this.authService.unauthenticateUser(user.username)
    return okVoid()
  }
}
