import { UsersNotified } from '@notification/domain/events/users-notified'
import { DomainEvents } from '@shared/domain/events/domain-events'
import { IObserver } from '@shared/domain/events/observer'

export class UpdateIncidentStatisticsObserver implements IObserver<UsersNotified> {
  constructor() {
    DomainEvents.subscribeObserver(this, UsersNotified.eventName)
  }

  async handle(event: UsersNotified) {
    // TODO
  }
}
