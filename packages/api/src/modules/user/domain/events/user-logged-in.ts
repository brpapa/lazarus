import { DomainEvent } from 'src/shared/domain/events/domain-event'
import { UUID } from 'src/shared/domain/models/uuid'
import { User } from 'src/modules/user/domain/models/user'

export class UserLoggedIn extends DomainEvent {
  static get eventName() {
    return 'UserLoggedIn'
  }

  user: User

  constructor(user: User) {
    super()
    this.user = user
  }

  get eventName() {
    return UserLoggedIn.eventName
  }

  get aggregatorId(): UUID {
    return this.user.id
  }
}
