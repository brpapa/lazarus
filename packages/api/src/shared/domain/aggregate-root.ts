import { UUID } from 'src/shared/domain/models/uuid'
import debug from 'debug'
import { DomainEvent } from './events/domain-event'
import { DomainEvents } from './events/domain-events'
import { Entity } from './entity'

const log = debug('app:domain')

/**
 * The main entity inside a aggregate cluster of related entities and value objects which are treated as a unit for data changes
 * It's the only entity in the cluster that is used for direct lookup
 *
 * The cluster boundary is how far fully constituted entities are in the aggregate
 *
 * [!] With all fully constituted entities inside of the aggregate, it's possible for the aggregate root to enforce all invariants within the aggregate when it's state changes.
 * [!] An aggregate must always be returned fully constituted from persistance. That constraint requires us to think hard about performance constraints and what's really necessary to fully pull from the database.
 */
export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: DomainEvent[] = []

  get domainEvents() {
    return this._domainEvents
  }

  public constructor(props: T, id?: UUID) {
    super(props, id)
  }

  protected addDomainEvent(event: DomainEvent) {
    this._domainEvents.push(event)
    DomainEvents.registerAggregate(this)
    const aggregateRootName = Reflect.getPrototypeOf(this)?.constructor.name
    const eventName = Reflect.getPrototypeOf(event)?.constructor.name
    log(`domain event created: ${aggregateRootName} => ${eventName}`)
  }

  public clearEvents() {
    this._domainEvents.splice(0, this._domainEvents.length)
  }
}
