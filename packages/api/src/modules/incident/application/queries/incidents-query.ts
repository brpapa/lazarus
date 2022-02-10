import assert from 'assert'
import { Debugger } from 'debug'
import { getCenter, getDistance } from 'geolib'
import { IncidentDTO } from 'src/modules/incident/adapter/dtos/incident-dto'
import { IncidentMapper } from 'src/modules/incident/adapter/mappers/incident-mapper'
import { IIncidentRepo } from 'src/modules/incident/adapter/repositories/incident-repo'
import { Incident } from 'src/modules/incident/domain/models/incident'
import { WithinBoxFilter, WithinCircleFilter } from 'src/modules/shared/adapter/dtos/filters'
import { Query } from 'src/modules/shared/logic/query'

export type Input = {
  filter?: {
    userId?: string
    /** the corner coordinates of map view in app */
    withinBox?: WithinBoxFilter
    withinCircle?: WithinCircleFilter
  }
}

export type Res = {
  incidents: IncidentDTO[]
  totalCount: number
}

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
    const filtersCount = req.filter
      ? Object.values(req.filter).filter((v) => v !== undefined).length
      : 0
    if (filtersCount === 0) return this.incidentRepo.findAll()
    if (filtersCount === 1) {
      if (req.filter?.userId !== undefined)
        return this.incidentRepo.findAllOfUser(req.filter.userId)

      if (req.filter?.withinCircle !== undefined) {
        const { center, radiusInMeters } = req.filter.withinCircle
        return this.incidentRepo.findAllLocatedWithinCircle(center, radiusInMeters)
      }

      if (req.filter?.withinBox !== undefined) return this.findManyWithinBox(req.filter.withinBox)

      throw new Error('Unreachable')
    } else {
      throw new Error('Different filters coexisting is not supported')
    }
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
