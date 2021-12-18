import { Result, err, okVoid } from 'src/shared/logic/result/result'
import { Command } from 'src/shared/logic/command'
import { User } from 'src/modules/user/domain/models/user'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user-repo'
import { DomainError, UnexpectedError, UseCaseError } from 'src/shared/logic/errors'
import { UserPhoneNumber } from 'src/modules/user/domain/models/user-phone-number'
import { UserPassword } from 'src/modules/user/domain/models/user-password'
import { Debugger } from 'debug'

export type SignUpInput = {
  username: string
  password: string
  phoneNumber: string
}
export type SignUpOkOutput = void
export type SignUpErrOutput = DomainError | UseCaseError | UnexpectedError
export type SignUpOutput = Result<SignUpOkOutput, SignUpErrOutput>

/** register a new user */
export class SignUpCommand extends Command<SignUpInput, SignUpOutput> {
  constructor(log: Debugger, private userRepo: IUserRepo) {
    super(log)
  }

  async execImpl(input: SignUpInput): Promise<SignUpOutput> {
    try {
      // todo: validar unicidade do username e do phoneNumber em relacao aos demais usuarios
      // new UseCaseError(`The phone number ${phoneNumber} is already associated to another account`)
      // new UseCaseError(`The username ${username} was already taken`)

      const userOrErr = UserPassword.create({ value: input.password }).andThen<User, DomainError>(
        (userPassword) =>
          User.create({
            username: input.username,
            password: userPassword,
            phoneNumber: UserPhoneNumber.create({ value: '123' }).asOk(), // TODO
          }),
      )

      if (userOrErr.isErr()) return err(userOrErr.error)

      await this.userRepo.commit(userOrErr.value)
      return okVoid()
    } catch (e) {
      return err(new UnexpectedError(e))
    }
  }
}
