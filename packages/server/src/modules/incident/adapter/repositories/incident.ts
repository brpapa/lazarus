import { Incident } from 'src/modules/incident/domain/models/incident'
import { IRepository } from '../../../../shared/infra/db/repository'

export interface IIncidentRepo extends IRepository<Incident> {
  /** by default, the retrieved incident will bring only the last 25 comments */
  findById(id: string): Promise<Incident | null>
  findManyByIds(ids: readonly string[]): Promise<Incident[]>
  exists(incident: Incident): Promise<boolean>
  commit(incident: Incident): Promise<void>
}
