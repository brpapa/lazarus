import { Debugger } from 'debug'
import { IncidentDTO } from 'src/modules/incident/adapter/dtos/incident-dto'
import { IncidentMapper } from 'src/modules/incident/adapter/mappers/incident-mapper'
import { IIncidentRepo } from 'src/modules/incident/adapter/repositories/incident-repo'
import { Incident } from 'src/modules/incident/domain/models/incident'
import { IncidentStatus } from 'src/modules/incident/domain/models/incident-status'
import { Media } from 'src/modules/incident/domain/models/media'
import { MediaType } from 'src/modules/incident/domain/models/media-type'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user-repo'
import { InvalidLocationError, Location } from 'src/shared/domain/models/location'
import { AppContext } from 'src/shared/logic/app-context'
import { Command } from 'src/shared/logic/command'
import { ApplicationError, UnauthenticatedError } from 'src/shared/logic/errors'
import { Guard } from 'src/shared/logic/guard'
import { err, ok, Result } from 'src/shared/logic/result/result'
import { MediaDTO } from '../../adapter/dtos/media-dto'

export type ReportIncidentInput = {
  title: string
  medias: MediaDTO[]
}
export type ReportIncidentOkResult = IncidentDTO
export type ReportIncidentErrResult =
  | InvalidLocationError
  | MediaQuantityError
  | UnauthenticatedError
  | UserWithoutLocationError
export type ReportIncidentResult = Result<ReportIncidentOkResult, ReportIncidentErrResult>

export class ReportIncidentCommand extends Command<ReportIncidentInput, ReportIncidentResult> {
  constructor(log: Debugger, private incidentRepo: IIncidentRepo, private userRepo: IUserRepo) {
    super(log)
  }

  async execImpl(input: ReportIncidentInput, ctx: AppContext): Promise<ReportIncidentResult> {
    if (!ctx.userId) return err(new UnauthenticatedError())

    const user = await this.userRepo.findById(ctx.userId)
    if (!user?.location)
      return err(new UserWithoutLocationError(`User ${ctx.userId} has not location saved yet`))

    const incident = Incident.create({
      ownerUserId: user.id,
      title: input.title,
      location: user.location,
      status: IncidentStatus.ACTIVE,
    })

    const incidentWithMediasOrErr = Guard.inRange(
      input.medias.length,
      Incident.ALLOWED_QTY_OF_MEDIAS_PER_INCIDENT,
      'media quantity',
    ).map(
      () => {
        const medias = input.medias.map((m) =>
          Media.create({
            ...m,
            incidentId: incident.id,
            type: MediaType.IMAGE, // TODO
            recordedAt: new Date(), // TODO
          }),
        )
        return incident.addMedias(medias)
      },
      (r) => new MediaQuantityError(r),
    )

    if (incidentWithMediasOrErr.isErr()) return err(incidentWithMediasOrErr.error)

    await this.incidentRepo.commit(incidentWithMediasOrErr.value)

    return ok(IncidentMapper.fromDomainToDTO(incidentWithMediasOrErr.value))
  }
}

class MediaQuantityError extends ApplicationError {}
class UserWithoutLocationError extends ApplicationError {}
