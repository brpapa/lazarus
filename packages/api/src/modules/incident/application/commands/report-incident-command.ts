import { Debugger } from 'debug'
import { IncidentDTO } from 'src/modules/incident/adapter/dtos/incident-dto'
import { IncidentMapper } from 'src/modules/incident/adapter/mappers/incident-mapper'
import { IIncidentRepo } from 'src/modules/incident/adapter/repositories/incident-repo'
import { Incident } from 'src/modules/incident/domain/models/incident'
import { IncidentStatus } from 'src/modules/incident/domain/models/incident-status'
import { Media } from 'src/modules/incident/domain/models/media'
import { MediaType } from 'src/modules/incident/domain/models/media-type'
import { LocationDTO } from 'src/shared/adapter/dtos/location-dto'
import { Location, InvalidLocationError } from 'src/shared/domain/models/location'
import { AppContext } from 'src/shared/logic/app-context'
import { Command } from 'src/shared/logic/command'
import { ApplicationError, DomainError, UnauthenticatedError } from 'src/shared/logic/errors'
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
export type ReportIncidentResult = Result<ReportIncidentOkResult, ReportIncidentErrResult>

export class ReportIncidentCommand extends Command<ReportIncidentInput, ReportIncidentResult> {
  constructor(log: Debugger, private incidentRepo: IIncidentRepo) {
    super(log)
  }

  async execImpl(input: ReportIncidentInput, ctx: AppContext): Promise<ReportIncidentResult> {
    if (!ctx.viewer) return err(new UnauthenticatedError())
    const ownerUserId = ctx.viewer.id
    const incidentLocation = ctx.viewer.currentLocation
    if (!incidentLocation) throw new Error('User has not location saved') // TODO

    const incidentOrErr = Location.create(incidentLocation)
      .mapOk((location) =>
        Incident.create({
          ownerUserId,
          title: input.title,
          location,
          status: IncidentStatus.ACTIVE,
        }),
      )
      .andThen((incident) =>
        Guard.inRange(
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
        ),
      )

    if (incidentOrErr.isErr()) return err(incidentOrErr.error)

    await this.incidentRepo.commit(incidentOrErr.value)
    return ok(IncidentMapper.fromDomainToDTO(incidentOrErr.value))
  }
}

class MediaQuantityError extends ApplicationError {}
