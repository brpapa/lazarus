import { Incident } from 'src/modules/incident/domain/models/incident'
import { LocationProps } from 'src/shared/domain/models/location'
import { IRepository } from '../../../../shared/infra/db/repository'

/** the incident loaded from database comes with the last 25 comments */
export interface IIncidentRepo extends IRepository<Incident> {
  findById(id: string): Promise<Incident | null>
  findByIdBatch(ids: string[]): Promise<Incident[]>
  findAll(): Promise<Incident[]>
  findAllLocatedWithinBox(
    centerPoint: LocationProps,
    dimensionsInMeters: { width: number; height: number },
  ): Promise<Incident[]>
  exists(incident: Incident): Promise<boolean>
  delete(incident: Incident): Promise<void>
  commit(incident: Incident): Promise<Incident>
}
