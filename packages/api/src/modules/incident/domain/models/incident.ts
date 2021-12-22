import assert from 'assert'
import { CommentPostedOnIncident } from 'src/modules/incident/domain/events/comment-posted-on-incident'
import { AggregateRoot } from 'src/shared/domain/aggregate-root'
import { UUID } from 'src/shared/domain/models/uuid'
import { WatchedList } from 'src/shared/domain/watched-list'
import { Range } from 'src/shared/logic/guard'
import { Location } from '../../../../shared/domain/models/location'
import { IncidentCreated } from '../events/incident-created'
import { ActivityLog } from './activity-log'
import { Comment } from './comment'
import { IncidentStatus } from './incident-status'
import { Media } from './media'
import { Reaction } from './reaction'
import { IncidentStatistics } from './statistics'

interface IncidentProps {
  ownerUserId: UUID
  title: string
  location: Location
  medias?: Media[]
  status?: IncidentStatus
  comments?: WatchedList<Comment>
  reactions?: WatchedList<Reaction>
  activityLogs?: ActivityLog[]
  statistics?: IncidentStatistics
  relevanceScore?: number // TODO: para que no mapa só mostre os mais relevantes no caso de ter muitos
  createdAt?: Date
  lastUpdateAt?: Date
}

export class Incident extends AggregateRoot<IncidentProps> {
  public static ALLOWED_QTY_OF_MEDIAS_PER_INCIDENT: Range = [1, 10]

  public get ownerUserId() { return this.props.ownerUserId } // prettier-ignore
  public get title() { return this.props.title } // prettier-ignore
  public get location() { return this.props.location } // prettier-ignore
  public get medias() { assert(this.props.medias); return this.props.medias } // prettier-ignore
  public get status() { assert(this.props.status); return this.props.status } // prettier-ignore
  public get comments() { assert(this.props.comments); return this.props.comments } // prettier-ignore
  public get reactions() { assert(this.props.reactions); return this.props.reactions } // prettier-ignore
  public get activityLogs() { assert(this.props.activityLogs); return this.props.activityLogs } // prettier-ignore
  public get statistics() { assert(this.props.statistics); return this.props.statistics } // prettier-ignore
  public get createdAt() { assert(this.props.createdAt); return this.props.createdAt } // prettier-ignore
  public get lastUpdateAt() { return this.props.lastUpdateAt } // prettier-ignore

  private constructor(props: IncidentProps, id?: UUID) {
    super(
      {
        ...props,
        medias: props.medias || [],
        status: props.status || IncidentStatus.PENDING,
        comments: props.comments || WatchedList.create<Comment>(),
        reactions: props.reactions || WatchedList.create<Reaction>(),
        activityLogs: props.activityLogs || [],
        statistics:
          props.statistics ||
          IncidentStatistics.create({
            commentsCount: 0,
            reactionsCount: 0,
            viewsCount: 0,
            usersNotified: 0,
          }),
        createdAt: props.createdAt || new Date(),
      },
      id,
    )
  }

  public static create(props: IncidentProps, id?: UUID): Incident {
    const incident = new Incident(props, id)

    const isNew = id === undefined
    if (isNew) incident.addDomainEvent(new IncidentCreated(incident))

    return incident
  }

  public addMedias(medias: Media[]) {
    medias.forEach((media) => this.addMedia(media))
    return this
  }

  private addMedia(media: Media) {
    const maxQtyExceeded = this.medias.length >= Incident.ALLOWED_QTY_OF_MEDIAS_PER_INCIDENT[1]
    const alreadyAdded = !!this.medias.find((m) => m.equals(media))
    if (!maxQtyExceeded && !alreadyAdded) this.medias.push(media)
    return this
  }

  public removeMedia(media: Media) {
    this.props.medias = this.medias.filter((m) => !m.equals(media))
    return this
  }

  public addComments(comments: Comment[]) {
    this.props.comments?.addBatch(comments)
    this.statistics.props.commentsCount += 1
    comments.forEach((comment) => this.addDomainEvent(new CommentPostedOnIncident(this, comment)))
    return this
  }
}
