import { UUID } from '@shared/domain/models/uuid'

/** The implementation must define a static getter `eventName` */
export abstract class DomainEvent {
  /** The id of domain event */
  public readonly id: UUID
  public occurredAt: Date

  public constructor() {
    this.id = new UUID()
    this.occurredAt = new Date()
  }

  public abstract get eventName(): string
  // public abstract get aggregatorId(): UUID
}
