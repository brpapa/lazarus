import { Incident } from 'src/modules/incident/domain/models/incident'
import { DomainEvent } from 'src/shared/domain/events/domain-event'
import { UUID } from 'src/shared/domain/id'

export class IncidentCreated extends DomainEvent {
  constructor(public incident: Incident) {
    super()
  }

  public getAggregatorId(): UUID {
    return this.incident.id
  }
}
