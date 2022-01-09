import { DomainEvent } from '@shared/domain/events/domain-event'
import { UUID } from '@shared/domain/models/uuid'
import { User } from '@user/domain/models/user'

export class UserSignedIn extends DomainEvent {
  constructor(public user: User, public pushToken?: string) {
    super()
  }

  static get eventName() {
    return UserSignedIn.name
  }

  get eventName() {
    return UserSignedIn.eventName
  }

  get aggregatorId(): UUID {
    return this.user.id
  }
}
