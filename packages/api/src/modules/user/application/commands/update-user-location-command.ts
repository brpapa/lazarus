import { Debugger } from 'debug'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user-repo'
import { LocationDTO } from 'src/modules/shared/adapter/dtos/location-dto'
import { InvalidLocationError, Location } from 'src/modules/shared/domain/models/location'
import { AppContext } from 'src/modules/shared/logic/app-context'
import { Command } from 'src/modules/shared/logic/command'
import { UnauthenticatedError, ApplicationError, UserNotFoundError } from 'src/modules/shared/logic/errors'
import { err, ok, Result } from 'src/modules/shared/logic/result/result'
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
    if (!user) return err(new UserNotFoundError(ctx.userId))

    user.updateLocation(location.value)

    await this.userRepo.commit(user)

    return ok(UserMapper.fromDomainToDTO(user))
  }
}
