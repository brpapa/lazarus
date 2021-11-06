import { DomainEvent } from './domain-event'

export interface IHandler<T extends DomainEvent> {
  setupSubscriptions(): void
  handle(event: T): void
}
