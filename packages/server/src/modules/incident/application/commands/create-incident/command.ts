import { Result, err, ok } from 'src/shared/logic/result/result'
import { Command } from 'src/shared/logic/command'
import { Incident } from 'src/modules/incident/domain/models/incident'
import { IIncidentRepo } from 'src/modules/incident/adapter/repositories/incident'
import { DomainError, UnexpectedError, UseCaseError } from 'src/shared/logic/errors'
import { Coordinate } from 'src/modules/incident/domain/models/coordinate'
import { Media } from 'src/modules/incident/domain/models/media'
import { IncidentMapper } from 'src/modules/incident/adapter/mappers/incident'
import { IncidentDTO } from 'src/modules/incident/adapter/dtos/incident'
import { UUID } from 'src/shared/domain/id'
import { IncidentStatus } from 'src/modules/incident/domain/models/incident-status'
import { MediaType } from 'src/modules/incident/domain/models/media-type'
import { Guard } from 'src/shared/logic/guard'

export type Request = {
  userId: string
  title: string
  coordinate: {
    latitude: number
    longitude: number
  }
  medias: Array<{
    url: string
    type: MediaType
    recordedAt: Date
  }>
}

export type Response = Result<IncidentDTO, DomainError | UseCaseError | UnexpectedError>

export class CreateIncidentCommand implements Command<Request, Response> {
  constructor(private incidentRepo: IIncidentRepo) {}

  async execute(req: Request): Promise<Response> {
    const incidentOrErr = Coordinate.create(req.coordinate)
      .andThen<Incident, DomainError>((coordinate) => {
        return Incident.create({
          ownerUserId: new UUID(req.userId),
          title: req.title,
          coordinate,
          status: IncidentStatus.ACTIVE,
        })
      })
      .andThen<Incident, DomainError | UseCaseError>((incident) => {
        return Guard.inRange(
          req.medias.length,
          Incident.ALLOWED_QTY_OF_MEDIAS_PER_INCIDENT,
          'media quantity',
        ).map(
          () => {
            const medias = req.medias.map((m) => Media.create({ ...m, incidentId: incident.id }))
            return incident.addMedias(medias)
          },
          (r) => new DomainError(r),
        )
      })

    if (incidentOrErr.isErr()) return err(incidentOrErr.error)

    try {
      await this.incidentRepo.commit(incidentOrErr.value)
      return ok(IncidentMapper.fromDomainToDTO(incidentOrErr.value))
    } catch (e) {
      return err(new UnexpectedError(e))
    }
  }
}