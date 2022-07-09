import { DomainEvent } from 'src/modules/shared/domain/events/domain-event'
import { UUID } from 'src/modules/shared/domain/models/uuid'
import { User } from 'src/modules/user/domain/models/user'

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
