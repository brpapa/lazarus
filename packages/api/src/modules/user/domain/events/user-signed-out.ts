import { DomainEvent } from '@shared/domain/events/domain-event'
import { UUID } from '@shared/domain/models/uuid'
import { User } from '@user/domain/models/user'

export class UserSignedOut extends DomainEvent {
  constructor(public user: User) {
    super()
  }

  static get eventName() {
    return UserSignedOut.name
  }

  get eventName() {
    return UserSignedOut.eventName
  }

  get aggregatorId(): UUID {
    return this.user.id
  }
}
