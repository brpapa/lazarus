import { DomainEvent } from 'src/shared/domain/events/domain-event'
import { UUID } from 'src/shared/domain/id'
import { Comment } from 'src/modules/incident/domain/models/comment'
import { Incident } from 'src/modules/incident/domain/models/incident'

export class CommentPostedOnIncident extends DomainEvent {
  constructor(public incident: Incident, public comment: Comment) {
    super()
  }

  public getAggregatorId(): UUID {
    return this.incident.id
  }
}
