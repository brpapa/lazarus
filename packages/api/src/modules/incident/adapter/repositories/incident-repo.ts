import { Incident } from 'src/modules/incident/domain/models/incident'
import { CoordinateProps } from 'src/shared/domain/models/coordinate'
import { IRepository } from '../../../../shared/infra/db/repository'

export interface IIncidentRepo extends IRepository<Incident> {
  /** by default, the retrieved incident will bring only the last 25 comments */
  findById(id: string): Promise<Incident | null>
  findMany(): Promise<Incident[]>
  findManyWithinBox(
    centerPoint: CoordinateProps,
    dimensionsInMeters: { width: number; height: number },
  ): Promise<Incident[]>
  exists(incident: Incident): Promise<boolean>
  commit(incident: Incident): Promise<Incident>
}
