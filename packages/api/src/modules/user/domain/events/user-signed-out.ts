import { DomainEvent } from 'src/modules/shared/domain/events/domain-event'
import { UUID } from 'src/modules/shared/domain/models/uuid'
import { User } from 'src/modules/user/domain/models/user'

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
