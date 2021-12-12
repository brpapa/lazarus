import { Incident } from 'src/modules/incident/domain/models/incident'
import { DomainEvent } from 'src/shared/domain/events/domain-event'
import { UUID } from 'src/shared/domain/models/uuid'

export class IncidentCreated extends DomainEvent {
  static get eventName() {
    return 'IncidentCreated'
  }

  constructor(public incident: Incident) {
    super()
  }

  get eventName() {
    return IncidentCreated.eventName
  }

  get aggregatorId(): UUID {
    return this.incident.id
  }
}
