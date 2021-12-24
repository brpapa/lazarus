import { TOPICS, pubSub } from 'src/infra/graphql/pub-sub'
import { IncidentCreated } from 'src/modules/incident/domain/events/incident-created'
import { DomainEvents } from 'src/shared/domain/events/domain-events'
import { IObserver } from 'src/shared/domain/events/observer'

export class IncidentCreatedObserver implements IObserver<IncidentCreated> {
  constructor() {
    DomainEvents.subscribeObserver(this, IncidentCreated.eventName)
  }

  async handle(event: IncidentCreated) {
    // userRepo.findManyWithinRadius(incident.location, 100)
    // TODO: notify relevant users
    // - if user is not active: send push notification
    // - if user is active: send to graphql subscription so the app is updated with new data

    // add to notification entity (with seen boolean)

    await pubSub.publish(TOPICS.INCIDENT.CREATED, event)
  }
}
