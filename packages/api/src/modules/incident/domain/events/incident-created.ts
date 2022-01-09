import { Incident } from '@incident/domain/models/incident'
import { DomainEvent } from '@shared/domain/events/domain-event'
import { UUID } from '@shared/domain/models/uuid'

export class IncidentCreated extends DomainEvent {
  constructor(public incident: Incident) {
    super()
  }

  static get eventName() {
    return IncidentCreated.name
  }

  get eventName() {
    return IncidentCreated.eventName
  }

  get aggregatorId(): UUID {
    return this.incident.id
  }
}
