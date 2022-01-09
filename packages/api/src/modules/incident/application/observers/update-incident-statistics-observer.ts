import { UsersNotified } from '@notification/domain/events/users-notified'
import { DomainEvents } from '@shared/domain/events/domain-events'
import { IObserver } from '@shared/domain/events/observer'
import { IIncidentRepo } from '../../adapter/repositories/incident-repo'

export class UpdateIncidentStatisticsObserver implements IObserver<UsersNotified> {
  constructor(private incidentRepo: IIncidentRepo) {
    DomainEvents.subscribeObserver(this, UsersNotified.eventName)
  }

  async handle(event: UsersNotified) {
    const incident = await this.incidentRepo.findById(event.incidentId)
    if (incident === null) return

    incident.statistics.incrementUsersNotifiedCount(event.count)
    await this.incidentRepo.commit(incident)
  }
}
