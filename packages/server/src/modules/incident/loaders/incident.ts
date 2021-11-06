import DataLoader, { BatchLoadFn } from 'dataloader'
import { LRUMap } from 'lru_map'
import { Incident } from 'src/modules/incident/domain/models/incident'
import { IIncidentRepo } from 'src/modules/incident/adapter/repositories/incident'
import { UUID } from 'src/shared/domain/id'

// data loader is business layer, batching/caching exists for any inner data storage layer, for any outer layer (rest, graphql)
export class IncidentLoader {
  static createDataLoader(repo: IIncidentRepo) {
    return new DataLoader(this.batchGetIncidents(repo), {
      cacheMap: new LRUMap(1e5), // limit the use of memory to only hold at most 1e5 cached values
      cacheKeyFn: (id) => id.toString(),
    })
  }

  // create a batch loading function (load many users at once)
  private static batchGetIncidents(repo: IIncidentRepo): BatchLoadFn<UUID, Incident> {
    return async (ids) => {
      const incidents = await repo.findManyByIds(ids.map((id) => id.toString()))

      // console.log(incidents)
      // TODO
      // const incidentsOrdered = ids.map(
      //   (id) =>
      //     incidents.find((incident) => incident && incident.id.toString() === id.toString()) ||
      //     new Error(`Incident not found: ${id}`),
      // )
      // return incidentsOrdered

      return incidents.map((v) => (v === null ? new Error() : v))
    }
  }
}

export type IncidentDataLoader = ReturnType<typeof IncidentLoader.createDataLoader>