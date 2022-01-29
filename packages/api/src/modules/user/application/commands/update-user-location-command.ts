import { Debugger } from 'debug'
import { LocationDTO } from '@shared/adapter/dtos/location-dto'
import { Location } from '@shared/domain/models/location'
import { AppContext } from '@shared/logic/app-context'
import { Command } from '@shared/logic/command'
import { UnauthenticatedError, UserNotFoundError } from '@shared/logic/errors'
import { err, ok, Result } from '@metis/shared'
import { IUserRepo } from '@user/adapter/repositories/user-repo'
import { UserDTO } from '../../adapter/dtos/user-dto'
import { UserMapper } from '../../adapter/mappers/user-mapper'

export type Input = {
  location: LocationDTO
}
export type OkRes = UserDTO
export type ErrRes = UnauthenticatedError | UserNotFoundError
export type Res = Result<OkRes, ErrRes>

export class UpdateUserLocationCommand extends Command<Input, Res> {
  constructor(log: Debugger, private userRepo: IUserRepo) {
    super(log)
  }

  async execImpl(input: Input, ctx: AppContext): Promise<Res> {
    if (!ctx.userId) return err(new UnauthenticatedError())

    const location = Location.create(input.location)

    const user = await this.userRepo.findById(ctx.userId)
    if (!user) return err(new UserNotFoundError())

    user.updateLocation(location)

    await this.userRepo.commit(user)

    return ok(UserMapper.fromDomainToDTO(user))
  }
}
