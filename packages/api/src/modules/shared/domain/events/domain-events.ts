import debug from 'debug'
import { AggregateRoot } from 'src/modules/shared/domain/aggregate-root'
import { UUID } from '../models/uuid'
import { DomainEvent } from './domain-event'
import { IObserver } from './observer'

const log = debug('app:domain')

/** Encapsulated global state */
export class DomainEvents {
  /** observers by event name */
  private static observers = new Map<string, IObserver<DomainEvent>[]>()
  /** aggregate root instances that contains domain events that eventually will be dispatched to your observers when the infra commits the unit of work */
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

  static async dispatchAllPendingEventsOfAggregate(aggRootId: UUID) {
    const agg = this.aggregateRoots.find((r) => r.id.equals(aggRootId))
    if (agg) {
      log(
        'Dispatching %o pending event(s) of %o aggregate root: %o',
        agg.pendingEvents.length,
        agg.aggregateRootName,
        agg.pendingEvents.map((e) => e.eventName),
      )
      // unregister and clear before execute any observer
      const dispatchPromises = agg.pendingEvents.map(this.dispatchEvent)
      agg.clearEvents()
      DomainEvents.unregisterAggregate(agg)

      // execute observers
      await Promise.all(dispatchPromises)
    }
  }

  static async dispatchEvent(event: DomainEvent) {
    const observers = DomainEvents.observers.get(event.eventName) || []
    if (observers.length === 0)
      log('[warn] %o event has no any observer subscribed yet', event.eventName)

    await Promise.all(
      observers.map(async (observer) => {
        const observerName = observer.constructor.name
        log('%o observer starts to handle the %o event', observerName, event.eventName)
        await Promise.resolve(observer.handle(event))
      }),
    )
  }

  private static unregisterAggregate(agg: AggregateRoot<any>) {
    DomainEvents.aggregateRoots = DomainEvents.aggregateRoots.filter((r) => !r.equals(agg))
  }

  static subscribeObserver<T extends DomainEvent>(observer: IObserver<T>, eventName: string) {
    const previousObservers = DomainEvents.observers.get(eventName) || []
    DomainEvents.observers.set(eventName, [...previousObservers, observer])

    const observerName = observer.constructor.name
    log('%o observer subscribed to the %o event', observerName, eventName)
  }

  static unsubscribeAllObservers() {
    DomainEvents.observers.clear()
  }
}
