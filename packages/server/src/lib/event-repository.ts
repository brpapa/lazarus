export interface IEntityConstructor<Entity> {
  new (events?: IEvent<any>[]): Entity
}

export default abstract class EventRepository<TEntity extends IEventEntity> {
  readonly #Entity: IEntityConstructor<TEntity>

  // receiving an Entity class as paremeter
  constructor(Entity: IEntityConstructor<TEntity>) {
    this.#Entity = Entity
  }

  abstract save(entity: TEntity): Promise<TEntity>

  abstract findById(id: any): Promise<TEntity | null>

  abstract runPaginatedQuery(
    query: { [key: string]: any },
    page: number,
    size: number,
    sort: { [field: string]: 1 | -1 },
  ): Promise<IPaginatedQueryResult<{ events: IEvent<TEntity>[] }>>
}
