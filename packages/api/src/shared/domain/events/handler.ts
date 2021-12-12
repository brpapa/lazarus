import { DomainEvent } from './domain-event'

/** also known as Observer */
export interface IHandler<T extends DomainEvent> {
  handle(event: T): void
}
