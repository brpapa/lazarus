import User from 'src/domain/entities/user'
import Event from 'src/lib/event'

export interface UserCreatedData {
  name: string
}

export default class UserCreated extends Event<UserCreatedData> {
  static readonly eventName = 'incident:created'

  constructor(data: UserCreatedData) {
    super(UserCreated.eventName, data)
  }

  static commit(agg: User, event: UserCreated) {
    agg.id = event.id
    agg.title = event.data.title
    agg.createdAt = event.timestamp
  }
}

