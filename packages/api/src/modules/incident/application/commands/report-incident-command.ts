import { IncidentDTO } from '@incident/adapter/dtos/incident-dto'
import { IncidentMapper } from '@incident/adapter/mappers/incident-mapper'
import { IIncidentRepo } from '@incident/adapter/repositories/incident-repo'
import { Incident } from '@incident/domain/models/incident'
import { IncidentStatusEnum } from '@incident/domain/models/incident-status'
import { Media } from '@incident/domain/models/media'
import { MediaTypeEnum } from '@incident/domain/models/media-type'
import { err, ok, Result } from '@metis/shared'
import { AppContext } from '@shared/logic/app-context'
import { Command } from '@shared/logic/command'
import { ApplicationError, UnauthenticatedError } from '@shared/logic/errors'
import { IUserRepo } from '@user/adapter/repositories/user-repo'
import { Debugger } from 'debug'
import { MediaDTO } from '../../adapter/dtos/media-dto'
import { IGeocodingService } from '../../adapter/geocoding-service'

export type Input = {
  title: string
  medias: MediaDTO[]
}
export type OkRes = IncidentDTO
export type ErrResult = InvalidMediaQuantityError | UnauthenticatedError
export type Res = Result<OkRes, ErrResult>

export class ReportIncidentCommand extends Command<Input, Res> {
  constructor(
    log: Debugger,
    private incidentRepo: IIncidentRepo,
    private userRepo: IUserRepo,
    private geocodingService: IGeocodingService,
  ) {
    super(log)
  }

  async execImpl(input: Input, ctx: AppContext): Promise<Res> {
    if (!ctx.userId) return err(new UnauthenticatedError())

    const user = await this.userRepo.findById(ctx.userId)
    if (!user?.location) throw new Error(`User ${ctx.userId} has not location saved yet`)

    const incident = Incident.create({
      ownerUserId: user.id,
      title: input.title,
      location: user.location,
      status: IncidentStatusEnum.ACTIVE,
    })

    const [min, max] = Incident.ALLOWED_QTY_OF_MEDIAS_PER_INCIDENT
    if (input.medias.length < min || input.medias.length > max)
      return err(new InvalidMediaQuantityError({ min, max }))

    const medias = input.medias.map((m) =>
      Media.create({
        ...m,
        incidentId: incident.id,
        type: MediaTypeEnum.IMAGE, // TODO
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

export class InvalidMediaQuantityError extends ApplicationError {}
