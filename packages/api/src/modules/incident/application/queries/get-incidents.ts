import assert from 'assert'
import { getCenter, getDistance } from 'geolib'
import { IncidentDTO } from 'src/modules/incident/adapter/dtos/incident-dto'
import { IncidentMapper } from 'src/modules/incident/adapter/mappers/incident-mapper'
import { IIncidentRepo } from 'src/modules/incident/adapter/repositories/incident-repo'
import { LocationDTO } from 'src/shared/adapter/dtos/location-dto'
import { Query } from 'src/shared/logic/query'
import { ok, Result } from 'src/shared/logic/result'
import { Incident } from '../../domain/models/incident'

type WithinBoundaryFilter = {
  northEast: LocationDTO
  southWest: LocationDTO
}

export type Request = {
  filter?: {
    /** the corner coordinates of map view in app */
    withinBoundary?: WithinBoundaryFilter
  }
  // TODO: limit the returned quantity of incidents, ordered by incident relevance, and filtered by actives (apagar do redis index no evento de incident closed)
  // https://redis.io/topics/indexes
  // first?: number
}
export type OkResponse = IncidentDTO[]
export type ErrResponse = void
export type Response = Result<OkResponse, ErrResponse>

/**
 * requisitado a cada resize do MapView
 */
export class GetIncidents implements Query<Request, Response> {
  private DIST_ACCURACY = 1e-5

  constructor(private readonly incidentRepo: IIncidentRepo) {}

  async exec(req: Request): Promise<Response> {
    const incidents = await (req.filter?.withinBoundary !== undefined
      ? this.findManyWithinBoundary(req.filter?.withinBoundary)
      : this.incidentRepo.findAll())

    return ok(incidents.map((incident) => IncidentMapper.fromDomainToDTO(incident)))
  }

  private findManyWithinBoundary(boundary: WithinBoundaryFilter): Promise<Incident[]> {
    const ne = boundary.northEast
    const sw = boundary.southWest
    const se = { latitude: ne.latitude, longitude: sw.longitude }

    const centerPoint = getCenter([ne, sw])
    assert(centerPoint !== false)

    return this.incidentRepo.findAllLocatedWithinBox(centerPoint, {
      width: getDistance(se, sw, this.DIST_ACCURACY),
      height: getDistance(ne, se, this.DIST_ACCURACY),
    })
  }
}
