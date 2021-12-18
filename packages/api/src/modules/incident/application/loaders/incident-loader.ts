import DataLoader, { BatchLoadFn } from 'dataloader'
import { LRUMap } from 'lru_map'
import { Incident } from 'src/modules/incident/domain/models/incident'
import { IIncidentRepo } from 'src/modules/incident/adapter/repositories/incident-repo'

export class IncidentLoaderFactory {
  constructor(private incidentRepo: IIncidentRepo) {}

  readonly CACHE_LIMIT = 1e5 // limit the use of memory to only hold at most 1e5 cached values

  create() {
    return new DataLoader(this.batchGetIncidents(), {
      cacheMap: new LRUMap(this.CACHE_LIMIT),
      cacheKeyFn: (id) => id.toString(),
    })
  }

  // create a batch loading function (load many entities at once)
  private batchGetIncidents(): BatchLoadFn<string, Incident> {
    return async (ids) => {
      const incidents = await this.incidentRepo.findManyByIds(ids.map((id) => id))
      return ids.map(
        (id) =>
          incidents.find((inc) => inc.id.toString() === id) ??
          new Error(`Incident not found: ${id}`),
      )
    }
  }
}
