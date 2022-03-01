import { err, okVoid, Result } from '@lazarus/shared'
import { Debugger } from 'debug'
import { IIncidentRepo } from 'src/modules/incident/adapter/repositories/incident-repo'
import { AppContext } from 'src/modules/shared/logic/app-context'
import { Command } from 'src/modules/shared/logic/command'
import {
  ApplicationError,
  UnauthenticatedError,
  UnauthorizedError,
} from 'src/modules/shared/logic/errors'

export type Input = {
  incidentId: string
}
export type OkRes = void
export type ErrResult = IncidentNotFound | UnauthenticatedError
export type Res = Result<OkRes, ErrResult>

export class DeleteIncidentCommand extends Command<Input, Res> {
  constructor(log: Debugger, private incidentRepo: IIncidentRepo) {
    super(log)
  }

  async execImpl(input: Input, ctx: AppContext): Promise<Res> {
    if (!ctx.userId) return err(new UnauthenticatedError())

    const incident = await this.incidentRepo.findById(input.incidentId)
    if (incident === null)
      return err(new IncidentNotFound(`Notification ${input.incidentId} not found`))

    if (incident.ownerUserId.toString() !== ctx.userId)
      return err(
        new UnauthorizedError(
          `The requester user '${
            ctx.userId
          }' is not the owner user of this incident: '${incident.id.toString()}'`,
        ),
      )

    await this.incidentRepo.delete(incident)
    return okVoid()
  }
}

export class IncidentNotFound extends ApplicationError {
  constructor(reason: string) {
    super(undefined, reason)
  }
}
