import { IncidentDTO } from 'src/modules/incident/adapter/dtos/incident-dto'
import { IncidentMapper } from 'src/modules/incident/adapter/mappers/incident-mapper'
import { IIncidentRepo } from 'src/modules/incident/adapter/repositories/incident-repo'
import { Incident } from 'src/modules/incident/domain/models/incident'
import { Media } from 'src/modules/incident/domain/models/media'
import { MediaTypeEnum } from 'src/modules/incident/domain/models/media-type'
import { err, ok, Result } from '@lazarus/shared'
import { AppContext } from 'src/modules/shared/logic/app-context'
import { Command } from 'src/modules/shared/logic/command'
import { ApplicationError, UnauthenticatedError } from 'src/modules/shared/logic/errors'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user-repo'
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
    })

    const [min, max] = Incident.ALLOWED_QTY_OF_MEDIAS_PER_INCIDENT
    if (input.medias.length < min || input.medias.length > max)
      return err(new InvalidMediaQuantityError({ min, max }))

    const medias = input.medias.map((m) =>
      Media.create({
        ...m,
        incidentId: incident.id,
        type: MediaTypeEnum[m.type],
        recordedAt: new Date(), // TODO
      }),
    )
    incident.addMedias(medias)

    const address = await this.geocodingService.fetchFormattedAddress(incident.location)
    if (address !== null) incident.setFormattedAddress(address)

    await this.incidentRepo.commit(incident)

    return ok(IncidentMapper.fromDomainToDTO(incident))
  }
}

export class InvalidMediaQuantityError extends ApplicationError {}
