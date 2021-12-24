import { Debugger } from 'debug'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user-repo'
import { LocationDTO } from 'src/shared/adapter/dtos/location-dto'
import { InvalidLocationError, Location } from 'src/shared/domain/models/location'
import { AppContext } from 'src/shared/logic/app-context'
import { Command } from 'src/shared/logic/command'
import { UnauthenticatedError, ApplicationError } from 'src/shared/logic/errors'
import { err, ok, Result } from 'src/shared/logic/result/result'
import { UserDTO } from '../../adapter/dtos/user-dto'
import { UserMapper } from '../../adapter/mappers/user-mapper'

export type UpdateUserLocationInput = {
  location: LocationDTO
}
export type UpdateUserLocationOkResult = UserDTO
export type UpdateUserLocationErrResult =
  | UnauthenticatedError
  | InvalidLocationError
  | UserNotFoundError
export type UpdateUserLocationResult = Result<
  UpdateUserLocationOkResult,
  UpdateUserLocationErrResult
>

export class UpdateUserLocationCommand extends Command<
  UpdateUserLocationInput,
  UpdateUserLocationResult
> {
  constructor(log: Debugger, private userRepo: IUserRepo) {
    super(log)
  }

  async execImpl(
    input: UpdateUserLocationInput,
    ctx: AppContext,
  ): Promise<UpdateUserLocationResult> {
    if (!ctx.userId) return err(new UnauthenticatedError())

    const location = Location.create(input.location)
    if (location.isErr()) return err(location.error)

    const user = await this.userRepo.findById(ctx.userId)
    if (!user) return err(new UserNotFoundError(`User ${ctx.userId} not found`))

    user.updateLocation(location.value)

    await this.userRepo.commit(user)

    return ok(UserMapper.fromDomainToDTO(user))
  }
}

class UserNotFoundError extends ApplicationError {}
