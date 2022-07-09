import { DomainEvent } from 'src/modules/shared/domain/events/domain-event'

/** count of users that received push notification */
export class UsersNotified extends DomainEvent {
  constructor(public count: number, public incidentId: string) {
    super()
  }

  static get eventName() {
    return UsersNotified.name
  }

  get eventName() {
    return UsersNotified.eventName
  }
}
