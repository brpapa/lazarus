import { DomainEvent } from 'src/shared/domain/events/domain-event'
import { UUID } from 'src/shared/domain/models/uuid'
import { Comment } from 'src/modules/incident/domain/models/comment'
import { Incident } from 'src/modules/incident/domain/models/incident'

export class CommentPostedOnIncident extends DomainEvent {
  static get eventName() {
    return 'CommentPostedOnIncident'
  }

  constructor(public incident: Incident, public comment: Comment) {
    super()
  }

  get eventName() {
    return CommentPostedOnIncident.eventName
  }

  get aggregatorId(): UUID {
    return this.incident.id
  }
}
