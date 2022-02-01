import { DomainEvent } from 'src/modules/shared/domain/events/domain-event'
import { UUID } from 'src/modules/shared/domain/models/uuid'
import { User } from 'src/modules/user/domain/models/user'

export class UserRegistered extends DomainEvent {
  constructor(public user: User) {
    super()
  }

  static get eventName() {
    return UserRegistered.name
  }
  get eventName() {
    return UserRegistered.eventName
  }

  get aggregatorId(): UUID {
    return this.user.id
  }
}
