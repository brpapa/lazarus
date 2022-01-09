import { ValueObject } from '@shared/domain/value-object'

export const LinkedEntityEnum = {
  INCIDENT: 'INCIDENT',
  USER: 'USER',
} as const
export type LinkedEntityEnum = typeof LinkedEntityEnum[keyof typeof LinkedEntityEnum]

interface NotificationLinkProps {
  entity: LinkedEntityEnum
  entityId: string
}

export class NotificationLink extends ValueObject<NotificationLinkProps> {
  get entity() { return this.props.entity } // prettier-ignore
  get entityId() { return this.props.entityId } // prettier-ignore

  private constructor(props: NotificationLinkProps) {
    super(props)
  }

  static create(props: NotificationLinkProps): NotificationLink {
    return new NotificationLink({ ...props })
  }
}
