import { Debugger } from 'debug'
import { IncidentDTO } from 'src/modules/incident/adapter/dtos/incident-dto'
import { IncidentMapper } from 'src/modules/incident/adapter/mappers/incident-mapper'
import { IIncidentRepo } from 'src/modules/incident/adapter/repositories/incident-repo'
import { Incident } from 'src/modules/incident/domain/models/incident'
import { IncidentStatus } from 'src/modules/incident/domain/models/incident-status'
import { Media } from 'src/modules/incident/domain/models/media'
import { MediaType } from 'src/modules/incident/domain/models/media-type'
import { AppContext } from 'src/modules/shared/logic/app-context'
import { Command } from 'src/modules/shared/logic/command'
import { ApplicationError, UnauthenticatedError } from 'src/modules/shared/logic/errors'
import { err, ok, Result } from 'src/modules/shared/logic/result/result'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user-repo'
import { MediaDTO } from '../../adapter/dtos/media-dto'
import { IGeocodingService } from '../../adapter/geocoding-service'

export type ReportIncidentInput = {
  title: string
  medias: MediaDTO[]
}
export type ReportIncidentOkResult = IncidentDTO
export type ReportIncidentErrResult = InvalidMediaQuantityError | UnauthenticatedError
export type ReportIncidentResult = Result<ReportIncidentOkResult, ReportIncidentErrResult>

export class ReportIncidentCommand extends Command<ReportIncidentInput, ReportIncidentResult> {
  constructor(
    log: Debugger,
    private incidentRepo: IIncidentRepo,
    private userRepo: IUserRepo,
    private geocodingService: IGeocodingService,
  ) {
    super(log)
  }

  async execImpl(input: ReportIncidentInput, ctx: AppContext): Promise<ReportIncidentResult> {
    if (!ctx.userId) return err(new UnauthenticatedError())

    const user = await this.userRepo.findById(ctx.userId)
    if (!user?.location) throw new Error(`User ${ctx.userId} has not location saved yet`)

    const incident = Incident.create({
      ownerUserId: user.id,
      title: input.title,
      location: user.location,
      status: IncidentStatus.ACTIVE,
    })

    const [min, max] = Incident.ALLOWED_QTY_OF_MEDIAS_PER_INCIDENT
    if (input.medias.length < min || input.medias.length > max)
      return err(new InvalidMediaQuantityError({ min, max }))

    const medias = input.medias.map((m) =>
      Media.create({
        ...m,
        incidentId: incident.id,
        type: MediaType.IMAGE, // TODO
        recordedAt: new Date(), // TODO
      }),
    )
    incident.addMedias(medias)

    const address = await this.geocodingService.fetchFormattedAddress(incident.location)
    if (address != null) incident.setFormattedAddress(address)

    await this.incidentRepo.commit(incident)

    return ok(IncidentMapper.fromDomainToDTO(incident))
  }
}

class InvalidMediaQuantityError extends ApplicationError {}
