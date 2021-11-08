import debug from 'debug'
import { AggregateRoot } from 'src/shared/domain/aggregate-root'
import { UUID } from '../models/uuid'
import { DomainEvent } from './domain-event'

const log = debug('app:domain')

type EventHandler<T extends DomainEvent> = (domainEvent: T) => void

/** Encapsulated global state */
export class DomainEvents {
  private static eventHandlers = new Map<string, EventHandler<any>[]>()
  private static aggregates: AggregateRoot<any>[] = []

  /**
   * Register an aggregate root instance which contains domain events that eventually be dispatched when the infra commits the unit of work
   */
  public static registerAggregate(agg: AggregateRoot<any>) {
    const alreadyRegistered = this.aggregates.some((r) => r.equals(agg))
    if (!alreadyRegistered) this.aggregates.push(agg)
  }

  public static unregisterAggregates() {
    DomainEvents.aggregates = []
  }

  public static dispatchEventsOfAggregate(aggId: UUID) {
    const agg = this.aggregates.find((r) => r.id.equals(aggId))
    if (agg) {
      agg.domainEvents.forEach(this.dispatchEvent)
      agg.clearEvents()
      DomainEvents.unregisterAggregate(agg)
    }
  }

  private static dispatchEvent(event: DomainEvent) {
    const eventName = event.constructor.name
    const handlers = DomainEvents.eventHandlers.get(eventName) || []
    log(`dispatching ${eventName} event for ${handlers.length} handlers`)
    handlers?.forEach((handler) => handler(event))
  }

  private static unregisterAggregate(agg: AggregateRoot<any>) {
    DomainEvents.aggregates = DomainEvents.aggregates.filter((r) => !r.equals(agg))
  }

  public static subscribeEventHandler<T extends DomainEvent>(
    handler: EventHandler<T>,
    eventName: string,
  ) {
    const previousHandlers = DomainEvents.eventHandlers.get(eventName)
    if (!previousHandlers) DomainEvents.eventHandlers.set(eventName, [])
    else DomainEvents.eventHandlers.set(eventName, [...previousHandlers, handler])
  }

  public static unsubscribeEventHandlers() {
    DomainEvents.eventHandlers.clear()
  }
}
