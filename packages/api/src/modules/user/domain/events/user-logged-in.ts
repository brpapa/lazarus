import { DomainEvent } from 'src/shared/domain/events/domain-event'
import { UUID } from 'src/shared/domain/models/uuid'
import { User } from 'src/modules/user/domain/models/user'

export class UserLoggedIn extends DomainEvent {
  public user: User

  constructor(user: User) {
    super()
    this.user = user
  }

  public getAggregatorId(): UUID {
    return this.user.id
  }
}
