import { err, ok, Result } from '@lazarus/shared'
import { Command } from 'src/modules/shared/logic/command'
import { UserDTO } from 'src/modules/user/adapter/dtos/user-dto'
import { UserMapper } from 'src/modules/user/adapter/mappers/user-mapper'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user-repo'
import { User } from 'src/modules/user/domain/models/user'
import { ShortPasswordError, UserPassword } from 'src/modules/user/domain/models/user-password'
import { Debugger } from 'debug'
import { InvalidEmailAddressError, UserEmail } from 'src/modules/user/domain/models/user-email'
import { ApplicationError } from 'src/modules/shared/logic/errors'

export type Input = {
  username: string
  name: string
  email: string
  password: string
}
export type OkRes = UserDTO
export type ErrRes =
  | ShortPasswordError
  | InvalidEmailAddressError
  | UsernameTakenError
  | EmailTakenError
export type Res = Result<OkRes, ErrRes>

/** register a new user */
export class SignUpCommand extends Command<Input, Res> {
  constructor(log: Debugger, private userRepo: IUserRepo) {
    super(log)
  }

  async execImpl(input: Input): Promise<Res> {
    const existingUserByUsername = await this.userRepo.findByUsername(input.username)
    if (existingUserByUsername !== null)
      return err(new UsernameTakenError({ username: input.username }))

    const existingUserByEmail = await this.userRepo.findByEmail(input.email)
    if (existingUserByEmail !== null) return err(new EmailTakenError({ email: input.email }))

    const userOrErr = UserPassword.create({ value: input.password })
      .andThen((password) =>
        UserEmail.create({ value: input.email }).mapOk((email) => [password, email] as const),
      )
      .mapOk<User>(([password, email]) =>
        User.create({
          username: input.username,
          email,
          password,
          name: input.name,
        }),
      )

    if (userOrErr.isErr()) return err(userOrErr.error)

    await this.userRepo.commit(userOrErr.value)
    return ok(UserMapper.fromDomainToDTO(userOrErr.value))
  }
}

export class UsernameTakenError extends ApplicationError {}
export class EmailTakenError extends ApplicationError {}
