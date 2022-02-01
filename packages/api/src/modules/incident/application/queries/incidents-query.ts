import { IncidentDTO } from 'src/modules/incident/adapter/dtos/incident-dto'
import { IncidentMapper } from 'src/modules/incident/adapter/mappers/incident-mapper'
import { IIncidentRepo } from 'src/modules/incident/adapter/repositories/incident-repo'
import { Incident } from 'src/modules/incident/domain/models/incident'
import { LocationDTO } from 'src/modules/shared/adapter/dtos/location-dto'
import { Query } from 'src/modules/shared/logic/query'
import assert from 'assert'
import { Debugger } from 'debug'
import { getCenter, getDistance } from 'geolib'

export type Input = {
  filter?: {
    /** the corner coordinates of map view in app */
    withinBox?: WithinBoxFilter
    withinCircle?: WithinCircleFilter
  }
}
type WithinBoxFilter = {
  northEast: LocationDTO
  southWest: LocationDTO
}
type WithinCircleFilter = {
  center: LocationDTO
  radiusInMeters: number
}

export type Res = {
  incidents: IncidentDTO[]
  totalCount: number
}

/** requested on each map view resize */
export class IncidentsQuery extends Query<Input, Res> {
  private DIST_ACCURACY = 0.01 // centimeter accuracy

  constructor(log: Debugger, private incidentRepo: IIncidentRepo) {
    super(log)
  }

  async execImpl(req: Input): Promise<Res> {
    const incidents = await this.query(req)
    return {
      incidents: incidents.map((incident) => IncidentMapper.fromDomainToDTO(incident)),
      totalCount: incidents.length,
    }
  }

  private query(req: Input): Promise<Incident[]> {
    if (req.filter?.withinCircle !== undefined) {
      const { center, radiusInMeters } = req.filter.withinCircle
      return this.incidentRepo.findAllLocatedWithinCircle(center, radiusInMeters)
    }

    if (req.filter?.withinBox !== undefined) {
      return this.findManyWithinBox(req.filter.withinBox)
    }

    return this.incidentRepo.findAll()
  }

  // FIXME
  private findManyWithinBox(boundary: WithinBoxFilter): Promise<Incident[]> {
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
