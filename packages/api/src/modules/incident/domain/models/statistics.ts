import { ValueObject } from 'src/modules/shared/domain/value-object'

interface IncidentStatisticsProps {
  commentsCount: number
  reactionsCount: number
  viewsCount: number
  usersNotified: number
}

export class IncidentStatistics extends ValueObject<IncidentStatisticsProps> {
  get commentsCount() { return this.props.commentsCount } // prettier-ignore
  get reactionsCount() { return this.props.reactionsCount } // prettier-ignore
  get viewsCount() { return this.props.viewsCount } // prettier-ignore
  get usersNotified() { return this.props.usersNotified } // prettier-ignore

  private constructor(props: IncidentStatisticsProps) {
    super(props)
  }

  public static create(props: IncidentStatisticsProps): IncidentStatistics {
    return new IncidentStatistics(props)
  }
}
