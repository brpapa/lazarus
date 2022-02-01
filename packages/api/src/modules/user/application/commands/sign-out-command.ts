import { Debugger } from 'debug'
import { Command } from 'src/modules/shared/logic/command'
import { UserNotFoundError } from 'src/modules/shared/logic/errors'
import { err, okVoid, Result } from '@metis/shared'
import { IAuthService } from 'src/modules/user/adapter/auth-service'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user-repo'

export type Input = {
  userId: string
}
export type Res = Result<void, UserNotFoundError>

export class SignOutCommand extends Command<Input, Res> {
  constructor(log: Debugger, private userRepo: IUserRepo, private authService: IAuthService) {
    super(log)
  }

  async execImpl(req: Input): Promise<Res> {
    const user = await this.userRepo.findById(req.userId)
    if (!user) return err(new UserNotFoundError())

    await this.authService.unauthenticateUser(user.username)
    return okVoid()
  }
}
