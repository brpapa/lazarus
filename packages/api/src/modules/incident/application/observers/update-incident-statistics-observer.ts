import { UsersNotified } from 'src/modules/notifications/domain/events/users-notified'
import { DomainEvents } from 'src/modules/shared/domain/events/domain-events'
import { IObserver } from 'src/modules/shared/domain/events/observer'

export class UpdateIncidentStatisticsObserver implements IObserver<UsersNotified> {
  constructor() {
    DomainEvents.subscribeObserver(this, UsersNotified.eventName)
  }

  async handle(event: UsersNotified) {
    // TODO
  }
}
