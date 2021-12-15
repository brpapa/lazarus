import debug from 'debug'
import { AggregateRoot } from 'src/shared/domain/aggregate-root'
import { UUID } from '../models/uuid'
import { DomainEvent } from './domain-event'
import { IHandler } from './handler'

const log = debug('app:domain')

/** Encapsulated global state */
export class DomainEvents {
  /** handlers by event name */
  private static eventHandlers = new Map<string, IHandler<DomainEvent>[]>()
  /** aggregate root instances that contains domain events that eventually will be dispatched to your handlers when the infra commits the unit of work */
  private static aggregateRoots: AggregateRoot<any>[] = []

  /** register the instance reference, so if an instance already was registered, the new pending events are visibile too */
  static registerAggregate(agg: AggregateRoot<any>) {
    const alreadyRegistered = this.aggregateRoots.some((r) => r.equals(agg))
    if (!alreadyRegistered) {
      this.aggregateRoots.push(agg)
    }
  }

  static unregisterAllAggregates() {
    DomainEvents.aggregateRoots = []
  }

  static dispatchAllPendingEventsOfAggregate(aggRootId: UUID) {
    const agg = this.aggregateRoots.find((r) => r.id.equals(aggRootId))
    if (agg) {
      log(
        'Dispatching %o pending event(s) of %o aggregate root',
        agg.pendingEvents.length,
        agg.aggregateRootName,
      )
      agg.pendingEvents.forEach(this.dispatchEvent)
      agg.clearEvents()
      DomainEvents.unregisterAggregate(agg)
    }
  }

  private static dispatchEvent(event: DomainEvent) {
    const handlers = DomainEvents.eventHandlers.get(event.eventName) || []
    if (handlers.length === 0) log('%o event has no any subscribed handler yet', event.eventName)
    handlers.forEach((handler) => {
      const handlerName = handler.constructor.name
      handler.handle(event)
      log('%o event dispatched to the %o handler', event.eventName, handlerName)
    })
  }

  private static unregisterAggregate(agg: AggregateRoot<any>) {
    DomainEvents.aggregateRoots = DomainEvents.aggregateRoots.filter((r) => !r.equals(agg))
  }

  static subscribeEventHandler<T extends DomainEvent>(handler: IHandler<T>, eventName: string) {
    const previousHandlers = DomainEvents.eventHandlers.get(eventName) || []
    DomainEvents.eventHandlers.set(eventName, [...previousHandlers, handler])

    const handlerName = handler.constructor.name
    log('%o handler subscribed to the %o event', handlerName, eventName)
  }

  static unsubscribeAllEventHandlers() {
    DomainEvents.eventHandlers.clear()
  }
}
