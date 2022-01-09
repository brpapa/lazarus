import { ValueObject } from '@shared/domain/value-object'

interface IncidentStatisticsProps {
  commentsCount: number
  reactionsCount: number
  viewsCount: number
  usersNotifiedCount: number
}

export class IncidentStatistics extends ValueObject<IncidentStatisticsProps> {
  get commentsCount() { return this.props.commentsCount } // prettier-ignore
  get reactionsCount() { return this.props.reactionsCount } // prettier-ignore
  get viewsCount() { return this.props.viewsCount } // prettier-ignore
  get usersNotifiedCount() { return this.props.usersNotifiedCount } // prettier-ignore

  private constructor(props: IncidentStatisticsProps) {
    super(props)
  }

  static create(props: IncidentStatisticsProps): IncidentStatistics {
    return new IncidentStatistics(props)
  }

  incrementUsersNotifiedCount(qty: number) {
    this.props.usersNotifiedCount += qty
  }
}
