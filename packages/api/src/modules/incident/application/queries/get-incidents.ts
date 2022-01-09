import assert from 'assert'
import { Debugger } from 'debug'
import { getCenter, getDistance } from 'geolib'
import { IncidentDTO } from '@incident/adapter/dtos/incident-dto'
import { IncidentMapper } from '@incident/adapter/mappers/incident-mapper'
import { IIncidentRepo } from '@incident/adapter/repositories/incident-repo'
import { LocationDTO } from '@shared/adapter/dtos/location-dto'
import { Query } from '@shared/logic/query'
import { ok, Result } from '@shared/logic/result'
import { Incident } from '../../domain/models/incident'

type WithinBoundaryFilter = {
  northEast: LocationDTO
  southWest: LocationDTO
}

export type GetIncidentsInput = {
  filter?: {
    /** the corner coordinates of map view in app */
    withinBoundary?: WithinBoundaryFilter
  }
  // TODO: limit the returned quantity of incidents, ordered by incident relevance, and filtered by actives (apagar do redis index no evento de incident closed)
  // https://redis.io/topics/indexes
  // first?: number
}
export type GetIncidentsOkResult = IncidentDTO[]
export type GetIncidentsErrResult = void
export type GetIncidentsResult = Result<GetIncidentsOkResult, GetIncidentsErrResult>

/** requested on each map view resize */
export class GetIncidents extends Query<GetIncidentsInput, GetIncidentsResult> {
  private DIST_ACCURACY = 0.01 // centimeter accuracy

  constructor(log: Debugger, private readonly incidentRepo: IIncidentRepo) {
    super(log)
  }

  async execImpl(req: GetIncidentsInput): Promise<GetIncidentsResult> {
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
