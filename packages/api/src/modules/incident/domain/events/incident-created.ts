import { Incident } from 'src/modules/incident/domain/models/incident'
import { DomainEvent } from 'src/modules/shared/domain/events/domain-event'
import { UUID } from 'src/modules/shared/domain/models/uuid'

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
