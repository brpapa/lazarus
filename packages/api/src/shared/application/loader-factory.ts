import DataLoader, { BatchLoadFn } from 'dataloader'
import { LRUMap } from 'lru_map'
import { Entity } from '../domain/entity'
import { IRepository } from '../infra/db/repository'

export abstract class LoaderFactory<T extends Entity<any>> {
  static readonly CACHE_LIMIT = 1e5 // limit the use of memory to only hold at most 1e5 cached values

  constructor(private repo: IRepository<T>, private entityName: string) {}

  create() {
    return new DataLoader(this.batch(), {
      cacheMap: new LRUMap(LoaderFactory.CACHE_LIMIT),
      cacheKeyFn: (id) => id.toString(),
    })
  }

  // a batch loading function to load many entities at once
  private batch(): BatchLoadFn<string, T> {
    return async (ids) => {
      const entities = await this.repo.findManyByIds(ids.map((id) => id))
      return ids.map(
        (id) =>
          entities.find((entity) => entity.id.toString() === id) ??
          new Error(`${this.entityName} not found: ${id}`),
      )
    }
  }
}
