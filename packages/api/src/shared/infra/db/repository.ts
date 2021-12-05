import { Entity } from 'src/shared/domain/entity'

export interface IRepository<T extends Entity<any>> {
  /** 
    update if already exists or add entity into database 
    after commit, should dispatch domain events if T is an Aggregate Root
    
    in case of an update, save non-aggregate tables before saving the aggregate so that any domain events on the aggregate get dispatched after this related-entity updates
  */
  commit(e: T): T | Promise<T>
}
