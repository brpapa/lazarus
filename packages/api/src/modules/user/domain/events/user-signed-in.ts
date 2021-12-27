import { DomainEvent } from 'src/modules/shared/domain/events/domain-event'
import { UUID } from 'src/modules/shared/domain/models/uuid'
import { User } from 'src/modules/user/domain/models/user'

export class UserSignedIn extends DomainEvent {
  static get eventName() {
    return 'UserSignedIn'
  }

  constructor(public user: User, public pushToken?: string) {
    super()
  }

  get eventName() {
    return UserSignedIn.eventName
  }

  get aggregatorId(): UUID {
    return this.user.id
  }
}
