import { Result, err, okVoid } from 'src/shared/logic/result/result'
import { Command } from 'src/shared/logic/command'
import { User } from 'src/modules/user/domain/models/user'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user'
import { DomainError, UnexpectedError, UseCaseError } from 'src/shared/logic/errors'
import { UserPhoneNumber } from 'src/modules/user/domain/models/user-phone-number'
import { UserPassword } from 'src/modules/user/domain/models/user-password'

export type Request = {
  username: string
  password: string
  phoneNumber: string
}
export type OkResponse = void
export type ErrResponse = DomainError | UseCaseError | UnexpectedError
export type Response = Result<void, ErrResponse>

export class RegisterUserCommand implements Command<Request, Response> {
  constructor(private userRepo: IUserRepo) {}

  async exec(req: Request): Promise<Response> {
    try {
      // todo: validar unicidade do username e do phoeNumber
      // new UseCaseError(`The phone number ${phoneNumber} is already associated to another account`)
      // new UseCaseError(`The username ${username} was already taken`)

      const passwordOrErr = UserPassword.create({ value: req.password })
      if (passwordOrErr.isErr()) return err(passwordOrErr.error)

      const phoneOrErr = UserPhoneNumber.create({ value: req.phoneNumber })
      if (phoneOrErr.isErr()) return err(phoneOrErr.error)

      const userOrErr = User.create({
        username: req.username,
        password: passwordOrErr.value,
        phoneNumber: phoneOrErr.value,
      })

      if (userOrErr.isErr()) return err(userOrErr.error)

      await this.userRepo.commit(userOrErr.value)
      return okVoid()
    } catch (e) {
      return err(new UnexpectedError(e))
    }
  }
}
