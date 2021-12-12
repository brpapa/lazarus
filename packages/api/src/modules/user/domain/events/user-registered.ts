import { DomainEvent } from 'src/shared/domain/events/domain-event'
import { UUID } from 'src/shared/domain/models/uuid'
import { User } from 'src/modules/user/domain/models/user'

export class UserRegistered extends DomainEvent {
  static get eventName() {
    return 'UserRegistered'
  }

  constructor(public user: User) {
    super()
  }

  get eventName() {
    return UserRegistered.eventName
  }

  get aggregatorId(): UUID {
    return this.user.id
  }
}
