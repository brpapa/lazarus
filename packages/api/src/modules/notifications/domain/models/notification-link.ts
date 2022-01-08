import { ValueObject } from 'src/modules/shared/domain/value-object'

export const LinkedEntity = {
  INCIDENT: 'INCIDENT',
  USER: 'USER',
} as const

interface NotificationLinkProps {
  entity: typeof LinkedEntity[keyof typeof LinkedEntity]
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
