import { Result, err, okVoid } from 'src/shared/logic/result/result'
import { Command } from 'src/shared/logic/command'
import { User } from 'src/modules/user/domain/models/user'
import { IUserRepo } from 'src/modules/user/adaptar/repositories/user'
import { DomainError, UnexpectedError, UseCaseError } from 'src/shared/logic/errors'
import { UserPhoneNumber } from 'src/modules/user/domain/models/user-phone-number'
import { UserPassword } from 'src/modules/user/domain/models/user-password'

export type Request = {
  firstName: string
  lastName: string
  password: string
  phoneNumber: string
}
export type Response = Result<void, DomainError | UseCaseError | UnexpectedError>

export class CreateUserCommand implements Command<Request, Response> {
  constructor(private userRepo: IUserRepo) {}

  async execute(req: Request): Promise<Response> {
    const passwordOrErr = UserPassword.create({ value: req.password })
    if (passwordOrErr.isErr()) return err(passwordOrErr.error)

    const phoneOrErr = UserPhoneNumber.create(req.phoneNumber)
    if (phoneOrErr.isErr()) return err(phoneOrErr.error)

    const userOrErr = User.create({
      firstName: req.firstName,
      lastName: req.lastName,
      password: passwordOrErr.value,
      phoneNumber: phoneOrErr.value,
    })

    if (userOrErr.isErr()) return err(userOrErr.error)

    try {
      await this.userRepo.commit(userOrErr.value)
      return okVoid()
    } catch (e) {
      return err(new UnexpectedError(e))
    }
  }
}
