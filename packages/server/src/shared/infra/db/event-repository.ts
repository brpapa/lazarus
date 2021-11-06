import { DomainEvent } from 'src/shared/domain/events/domain-event'

export interface IEntityConstructor<Entity> {
  new (events?: DomainEvent[]): Entity
}

export abstract class EventRepository<T> {
  readonly #Entity: IEntityConstructor<T>

  // receiving an Entity class as paremeter
  constructor(Entity: IEntityConstructor<T>) {
    this.#Entity = Entity
  }

  abstract save(entity: T): Promise<T>

  abstract findById(id: any): Promise<T | null>
}
