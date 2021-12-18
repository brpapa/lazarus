import DataLoader, { BatchLoadFn } from 'dataloader'
import { LRUMap } from 'lru_map'
import { IUserRepo } from '../../adapter/repositories/user-repo'
import { User } from '../../domain/models/user'

export class UserLoaderFactory {
  constructor(private repo: IUserRepo) {}

  readonly CACHE_LIMIT = 1e5 // limit the use of memory to only hold at most 1e5 cached values

  create() {
    return new DataLoader(this.batchGetUsers(), {
      cacheMap: new LRUMap(this.CACHE_LIMIT),
      cacheKeyFn: (id) => id.toString(),
    })
  }

  // create a batch loading function (load many users at once)
  private batchGetUsers(): BatchLoadFn<string, User> {
    return async (ids) => {
      const users = await this.repo.findManyByIds(ids.map((id) => id))
      return ids.map(
        (id) => users.find((inc) => inc.id.toString() === id) ?? new Error(`User not found: ${id}`),
      )
    }
  }
}
