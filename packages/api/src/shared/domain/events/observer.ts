import { DomainEvent } from './domain-event'

export interface IObserver<T extends DomainEvent> {
  handle(event: T): void | Promise<void>
}
