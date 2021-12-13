import debug from 'debug'
import { AggregateRoot } from 'src/shared/domain/aggregate-root'
import { UUID } from '../models/uuid'
import { DomainEvent } from './domain-event'
import { IHandler } from './handler'

const log = debug('app:shared:domain')

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
      // log(`'${agg.aggregateRootName}' aggregate root registered`)
    }
  }

  static unregisterAllAggregates() {
    DomainEvents.aggregateRoots = []
  }

  static dispatchAllPendingEventsOfAggregate(aggRootId: UUID) {
    const agg = this.aggregateRoots.find((r) => r.id.equals(aggRootId))
    if (agg) {
      log(
        `Dispatching ${agg.pendingEvents.length} pending event(s) of '${agg.aggregateRootName}' aggregate root`,
      )
      agg.pendingEvents.forEach(this.dispatchEvent)
      agg.clearEvents()
      DomainEvents.unregisterAggregate(agg)
    }
  }

  private static dispatchEvent(event: DomainEvent) {
    const handlers = DomainEvents.eventHandlers.get(event.eventName) || []
    if (handlers.length === 0) log(`'${event.eventName}' event has no any subscribed handler yet`)
    handlers.forEach((handler) => {
      const handlerName = handler.constructor.name
      handler.handle(event)
      log(`'${event.eventName}' event dispatched to '${handlerName}' handler`)
    })
  }

  private static unregisterAggregate(agg: AggregateRoot<any>) {
    DomainEvents.aggregateRoots = DomainEvents.aggregateRoots.filter((r) => !r.equals(agg))
  }

  static subscribeEventHandler<T extends DomainEvent>(handler: IHandler<T>, eventName: string) {
    const previousHandlers = DomainEvents.eventHandlers.get(eventName) || []
    DomainEvents.eventHandlers.set(eventName, [...previousHandlers, handler])

    const handlerName = handler.constructor.name
    log(`'${handlerName}' handler subscribed to '${eventName}' event`)
  }

  static unsubscribeAllEventHandlers() {
    DomainEvents.eventHandlers.clear()
  }
}
