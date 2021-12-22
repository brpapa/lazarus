import { okVoid, Result } from 'src/shared/logic/result/result'
import { Command } from 'src/shared/logic/command'
import { ApplicationError } from 'src/shared/logic/errors'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user-repo'
import { Debugger } from 'debug'
import { AppContext } from 'src/shared/logic/app-context'
import { LocationDTO } from 'src/shared/adapter/dtos/location-dto'

export type SyncUserLocationInput = {
  location: LocationDTO
}
export type SyncUserLocationResult = Result<void, ApplicationError>

export class SyncUserLocation extends Command<SyncUserLocationInput, SyncUserLocationResult> {
  constructor(log: Debugger, private userRepo: IUserRepo) {
    super(log)
  }

  async execImpl(input: SyncUserLocationInput, ctx: AppContext): Promise<SyncUserLocationResult> {
    return okVoid()
  }
}
