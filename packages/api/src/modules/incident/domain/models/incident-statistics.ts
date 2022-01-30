import { ValueObject } from '@shared/domain/value-object'
import assert from 'assert'

interface IncidentStatisticsProps {
  commentsCount?: number
  reactionsCount?: number
  viewsCount?: number
  usersNotifiedCount?: number
}

export class IncidentStatistics extends ValueObject<IncidentStatisticsProps> {
  get commentsCount() { assert(this.props.commentsCount !== undefined); return this.props.commentsCount } // prettier-ignore
  get reactionsCount() { assert(this.props.reactionsCount !== undefined); return this.props.reactionsCount } // prettier-ignore
  get viewsCount() { assert(this.props.viewsCount !== undefined); return this.props.viewsCount } // prettier-ignore
  get usersNotifiedCount() { assert(this.props.usersNotifiedCount !== undefined); return this.props.usersNotifiedCount } // prettier-ignore

  private constructor(props: IncidentStatisticsProps) {
    super({
      commentsCount: props.commentsCount || 0,
      reactionsCount: props.reactionsCount || 0,
      viewsCount: props.viewsCount || 0,
      usersNotifiedCount: props.usersNotifiedCount || 0,
    })
  }

  static create(props: IncidentStatisticsProps): IncidentStatistics {
    return new IncidentStatistics(props)
  }

  incrementUsersNotifiedCount(qty: number) {
    if (!this.props.usersNotifiedCount) this.props.usersNotifiedCount = 0
    this.props.usersNotifiedCount += qty
  }

  incrementCommentsCount(qty: number) {
    if (!this.props.commentsCount) this.props.commentsCount = 0
    this.props.commentsCount += qty
  }
}
