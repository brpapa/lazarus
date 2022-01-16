import { Command } from '@shared/logic/command'
import { err, ok, Result } from '@metis/shared'
import { UserDTO } from '@user/adapter/dtos/user-dto'
import { UserMapper } from '@user/adapter/mappers/user-mapper'
import { IUserRepo } from '@user/adapter/repositories/user-repo'
import { User } from '@user/domain/models/user'
import { ShortPasswordError, UserPassword } from '@user/domain/models/user-password'
import { InvalidPhoneNumberError, UserPhoneNumber } from '@user/domain/models/user-phone-number'
import { Debugger } from 'debug'

export type SignUpInput = {
  username: string
  phoneNumber: string
  password: string
}
export type SignUpOkResult = UserDTO
export type SignUpErrResult = ShortPasswordError | InvalidPhoneNumberError
export type SignUpResult = Result<SignUpOkResult, SignUpErrResult>

/** register a new user */
export class SignUpCommand extends Command<SignUpInput, SignUpResult> {
  constructor(log: Debugger, private userRepo: IUserRepo) {
    super(log)
  }

  async execImpl(input: SignUpInput): Promise<SignUpResult> {
    // todo: validar unicidade do username e do phoneNumber em relacao aos demais usuarios
    // new PhoneNumberTakenError(`The phone number ${phoneNumber} is already associated to another account`)
    // new UsernameTakenError(`The username ${username} was already taken`)

    const userOrErr = UserPassword.create({ value: input.password })
      .andThen((password) =>
        UserPhoneNumber.create({ value: input.phoneNumber }).mapOk(
          (phoneNumber) => [password, phoneNumber] as const,
        ),
      )
      .mapOk<User>(([password, phoneNumber]) =>
        User.create({
          username: input.username,
          password,
          phoneNumber,
        }),
      )

    if (userOrErr.isErr()) return err(userOrErr.error)

    await this.userRepo.commit(userOrErr.value)
    return ok(UserMapper.fromDomainToDTO(userOrErr.value))
  }
}

// class UsernameTakenError extends ApplicationError {}
// class PhoneNumberTakenError extends ApplicationError {}
