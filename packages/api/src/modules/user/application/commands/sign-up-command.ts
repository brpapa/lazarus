import { Debugger } from 'debug'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user-repo'
import { User } from 'src/modules/user/domain/models/user'
import { UserPassword } from 'src/modules/user/domain/models/user-password'
import { UserPhoneNumber } from 'src/modules/user/domain/models/user-phone-number'
import { Command } from 'src/shared/logic/command'
import { BusinessError, DomainError } from 'src/shared/logic/errors'
import { err, ok, Result } from 'src/shared/logic/result/result'
import { UserDTO } from '../../adapter/dtos/user-dto'
import { UserMapper } from '../../adapter/mappers/user-mapper'

export type SignUpInput = {
  username: string
  password: string
  phoneNumber: string
}
export type SignUpOkResult = UserDTO
export type SignUpErrResult = DomainError | BusinessError
export type SignUpResult = Result<SignUpOkResult, SignUpErrResult>

/** register a new user */
export class SignUpCommand extends Command<SignUpInput, SignUpResult> {
  constructor(log: Debugger, private userRepo: IUserRepo) {
    super(log)
  }

  async execImpl(input: SignUpInput): Promise<SignUpResult> {
    // todo: validar unicidade do username e do phoneNumber em relacao aos demais usuarios
    // new BusinessError(`The phone number ${phoneNumber} is already associated to another account`)
    // new BusinessError(`The username ${username} was already taken`)

    const userOrErr = UserPassword.create({ value: input.password })
      .andThen((password) =>
        UserPhoneNumber.create({ value: input.phoneNumber }).mapOk(
          (phoneNumber) => [password, phoneNumber] as const,
        ),
      )
      .andThen<User, DomainError>(([password, phoneNumber]) =>
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
