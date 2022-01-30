import assert from 'assert'
import { CommentPostedOnIncident } from '@incident/domain/events/comment-posted-on-incident'
import { AggregateRoot } from '@shared/domain/aggregate-root'
import { UUID } from '@shared/domain/models/uuid'
import { WatchedList } from '@shared/domain/watched-list'
import { Range } from '@shared/logic/guard'
import { Location } from '../../../shared/domain/models/location'
import { IncidentCreated } from '../events/incident-created'
import { ActivityLog } from './activity-log'
import { Comment } from './comment'
import { IncidentStatus } from './incident-status'
import { Media } from './media'
import { Reaction } from './reaction'
import { IncidentStatistics } from './incident-statistics'

interface IncidentProps {
  ownerUserId: UUID
  title: string
  location: Location
  formattedAddress?: string
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
  static ALLOWED_QTY_OF_MEDIAS_PER_INCIDENT: Range = [1, 10]

  get ownerUserId() { return this.props.ownerUserId } // prettier-ignore
  get title() { return this.props.title } // prettier-ignore
  get location() { return this.props.location } // prettier-ignore
  get formattedAddress() { return this.props.formattedAddress } // prettier-ignore
  get medias() { assert(this.props.medias); return this.props.medias } // prettier-ignore
  get status() { assert(this.props.status); return this.props.status } // prettier-ignore
  get comments() { assert(this.props.comments); return this.props.comments } // prettier-ignore
  get reactions() { assert(this.props.reactions); return this.props.reactions } // prettier-ignore
  get activityLogs() { assert(this.props.activityLogs); return this.props.activityLogs } // prettier-ignore
  get statistics() { assert(this.props.statistics); return this.props.statistics } // prettier-ignore
  get createdAt() { assert(this.props.createdAt); return this.props.createdAt } // prettier-ignore
  get lastUpdateAt() { return this.props.lastUpdateAt } // prettier-ignore

  private constructor(props: IncidentProps, id?: UUID) {
    super(
      {
        ...props,
        medias: props.medias || [],
        status: props.status || IncidentStatus.PENDING,
        comments: props.comments || WatchedList.create<Comment>(),
        reactions: props.reactions || WatchedList.create<Reaction>(),
        activityLogs: props.activityLogs || [],
        statistics: props.statistics || IncidentStatistics.create({}),
        createdAt: props.createdAt || new Date(),
      },
      id,
    )
  }

  static create(props: IncidentProps, id?: UUID): Incident {
    const incident = new Incident(props, id)

    const isNew = id === undefined
    if (isNew) incident.addDomainEvent(new IncidentCreated(incident))

    return incident
  }

  addMedias(medias: Media[]) {
    medias.forEach((media) => this.addMedia(media))
    return this
  }

  private addMedia(media: Media) {
    const maxQtyExceeded = this.medias.length >= Incident.ALLOWED_QTY_OF_MEDIAS_PER_INCIDENT[1]
    const alreadyAdded = !!this.medias.find((m) => m.equals(media))
    if (!maxQtyExceeded && !alreadyAdded) this.medias.push(media)
    return this
  }

  removeMedia(media: Media) {
    this.props.medias = this.medias.filter((m) => !m.equals(media))
    return this
  }

  addComments(comments: Comment[]) {
    this.props.comments?.addBatch(comments)
    this.statistics.incrementCommentsCount(comments.length)
    comments.forEach((comment) => this.addDomainEvent(new CommentPostedOnIncident(this, comment)))
    return this
  }

  setFormattedAddress(formattedAddress: string) {
    this.props.formattedAddress = formattedAddress
  }
}
