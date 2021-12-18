import { err, okVoid, Result } from 'src/shared/logic/result/result'
import { Command } from 'src/shared/logic/command'
import { UnexpectedError, UseCaseError } from 'src/shared/logic/errors'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user-repo'
import { Debugger } from 'debug'

export type SyncUserLocationInput = {
  username: string
  password: string
}
export type SyncUserLocationOutput = Result<void, UseCaseError | UnexpectedError>

export class SyncUserLocation extends Command<SyncUserLocationInput, SyncUserLocationOutput> {
  constructor(log: Debugger, private userRepo: IUserRepo) {
    super(log)
  }

  async execImpl(input: SyncUserLocationInput): Promise<SyncUserLocationOutput> {
    try {
      return okVoid()
    } catch (e) {
      return err(new UnexpectedError(e))
    }
  }
}
