import { Entity } from 'src/modules/shared/domain/entity'
import { UUID } from 'src/modules/shared/domain/models/uuid'

interface NotificationProps {
  userId: string
  content: string
  seen: boolean
  callToAction: {
    incidentId?: string
  }
}

export class Notification extends Entity<NotificationProps> {
  get userId() { return this.props.userId } // prettier-ignore
  get content() { return this.props.content } // prettier-ignore
  get seen() { return this.props.seen } // prettier-ignore

  private constructor(props: NotificationProps, id?: UUID) {
    super(props, id)
  }

  static create(props: NotificationProps, id?: UUID) {
    return new Notification(props, id)
  }
}
