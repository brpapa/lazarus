import assert from 'assert'
import { Entity } from '@shared/domain/entity'
import { UUID } from '@shared/domain/models/uuid'
import { NotificationLink } from './notification-link'
import { PushMessage } from './push-message'

export const NotificationType = {
  NEARBY_INCIDENT_CREATED: 'NEARBY_INCIDENT_CREATED',
} as const

interface NotificationProps {
  targetUserId: string
  type: typeof NotificationType[keyof typeof NotificationType]
  title: string
  subtitle: string
  body: string
  link: NotificationLink
  seen?: boolean
  createdAt?: Date
}

export class Notification extends Entity<NotificationProps> {
  get targetUserId() { return this.props.targetUserId } // prettier-ignore
  get type() { return this.props.type } // prettier-ignore
  get title() { return this.props.title } // prettier-ignore
  get subtitle() { return this.props.subtitle } // prettier-ignore
  get body() { return this.props.body } // prettier-ignore
  get link() { return this.props.link } // prettier-ignore
  get seen() { assert(this.props.seen !== undefined); return this.props.seen } // prettier-ignore
  get createdAt() { assert(this.props.createdAt !== undefined); return this.props.createdAt } // prettier-ignore

  private constructor(props: NotificationProps, id?: UUID) {
    super(
      {
        ...props,
        seen: props.seen || false,
        createdAt: props.createdAt || new Date(),
      },
      id,
    )
  }

  static create(props: NotificationProps, id?: UUID) {
    return new Notification(props, id)
  }

  /** format required to send as push notification */
  toPushMessage(pushTokens: string[]): PushMessage {
    return {
      to: pushTokens,
      title: this.props.title,
      subtitle: this.props.subtitle,
      body: this.props.body,
      data: {
        link: this.props.link,
        notificationId: this.id.toString(),
      },
      sound: 'default',
    }
  }
}
