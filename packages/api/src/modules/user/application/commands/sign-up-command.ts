import { Debugger } from 'debug'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user-repo'
import { User } from 'src/modules/user/domain/models/user'
import { ShortPasswordError, UserPassword } from 'src/modules/user/domain/models/user-password'
import {
  InvalidPhoneNumberError,
  UserPhoneNumber,
} from 'src/modules/user/domain/models/user-phone-number'
import { Command } from 'src/modules/shared/logic/command'
import { err, ok, Result } from 'src/modules/shared/logic/result/result'
import { UserDTO } from '../../adapter/dtos/user-dto'
import { UserMapper } from '../../adapter/mappers/user-mapper'

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
