import { getDistance, getCenter } from 'geolib'
import { UnexpectedError } from 'src/shared/logic/errors'
import { Query } from 'src/shared/logic/query'
import { err, ok, Result } from 'src/shared/logic/result'
import { IncidentDTO } from 'src/modules/incident/adapter/dtos/incident'
import { IncidentMapper } from 'src/modules/incident/adapter/mappers/incident'
import { IIncidentRepo } from 'src/modules/incident/adapter/repositories/incident'
import assert from 'assert'
import { CoordinateDTO } from 'src/shared/adapter/dtos/coordinate'

export type Request = {
  /** the corner coordinates of map view in app */
  boundary: {
    northEast: CoordinateDTO
    southWest: CoordinateDTO
  }
  // TODO: limit the returned quantity of incidents, ordered by incident relevance, and filtered by actives (apagar do redis index no evento de incident closed)
  // https://redis.io/topics/indexes
  // first?: number
}
export type OkResponse = IncidentDTO[]
export type ErrResponse = UnexpectedError
export type Response = Result<OkResponse, ErrResponse>

/**
 * requisitado a cada novo onRegionChangeComplete do MapView
 */
export class GetIncidentsWithinBoundary implements Query<Request, Response> {
  private DIST_ACCURACY = 1e-5

  constructor(private readonly incidentRepo: IIncidentRepo) {}

  async exec(req: Request): Promise<Response> {
    try {
      const ne = req.boundary.northEast
      const sw = req.boundary.southWest
      const se = { latitude: ne.latitude, longitude: sw.longitude }

      const centerPoint = getCenter([ne, sw]) 
      assert(centerPoint !== false)

      const incidents = await this.incidentRepo.findManyWithinBox(centerPoint, {
        width: getDistance(se, sw, this.DIST_ACCURACY),
        height: getDistance(ne, se, this.DIST_ACCURACY),
      })

      return ok(incidents.map((incident) => IncidentMapper.fromDomainToDTO(incident)))
    } catch (e) {
      return err(new UnexpectedError(e))
    }
  }
}