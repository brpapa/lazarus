import { DomainEvent } from '@shared/domain/events/domain-event'
import { UUID } from '@shared/domain/models/uuid'
import { User } from '@user/domain/models/user'

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
