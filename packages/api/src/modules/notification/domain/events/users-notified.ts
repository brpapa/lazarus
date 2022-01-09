import { DomainEvent } from '@shared/domain/events/domain-event'

/** users that received push notification */
export class UsersNotified extends DomainEvent {
  constructor(public usersIds: string[]) {
    super()
  }

  static get eventName() {
    return UsersNotified.name
  }

  get eventName() {
    return UsersNotified.eventName
  }
}
