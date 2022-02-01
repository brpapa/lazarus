import { DomainEvent } from 'src/modules/shared/domain/events/domain-event'
import { UUID } from 'src/modules/shared/domain/models/uuid'
import { Comment } from 'src/modules/incident/domain/models/comment'
import { Incident } from 'src/modules/incident/domain/models/incident'

export class CommentPostedOnIncident extends DomainEvent {
  constructor(public incident: Incident, public comment: Comment) {
    super()
  }

  static get eventName() {
    return CommentPostedOnIncident.name
  }

  get eventName() {
    return CommentPostedOnIncident.eventName
  }

  get aggregatorId(): UUID {
    return this.incident.id
  }
}
