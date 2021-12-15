import { err, okVoid, Result } from 'src/shared/logic/result/result'
import { Command } from 'src/shared/logic/command'
import { UnexpectedError, UseCaseError } from 'src/shared/logic/errors'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user'

export type Request = {
  username: string
  password: string
}
export type OkResponse = void
export type ErrResponse = UseCaseError | UnexpectedError
export type Response = Result<OkResponse, ErrResponse>

// TODO
export class UpdateUserLocation extends Command<Request, Response> {
  constructor(private userRepo: IUserRepo) {super()}

  async execImpl(req: Request): Promise<Response> {
    try {
      return okVoid()
    } catch (e) {
      return err(new UnexpectedError(e))
    }
  }
}
