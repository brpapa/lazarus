import { DomainEvent } from '@shared/domain/events/domain-event'
import { UUID } from '@shared/domain/models/uuid'
import { Comment } from '@incident/domain/models/comment'
import { Incident } from '@incident/domain/models/incident'

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
