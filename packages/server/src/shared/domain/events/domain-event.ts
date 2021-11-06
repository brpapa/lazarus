import { UUID } from 'src/shared/domain/id'

export abstract class DomainEvent {
  public readonly id: UUID
  public occurredAt: Date

  public constructor() {
    this.id = new UUID()
    this.occurredAt = new Date()
  }

  public abstract getAggregatorId(): UUID
}
