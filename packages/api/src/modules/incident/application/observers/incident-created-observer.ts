import { TOPICS, pubSub } from 'src/api/graphql/pub-sub'
import { IncidentCreated } from 'src/modules/incident/domain/events/incident-created'
import { DomainEvents } from 'src/modules/shared/domain/events/domain-events'
import { IObserver } from 'src/modules/shared/domain/events/observer'

/**
 * propagate event to the graphql subscription so active users are updated with the new incident in real time
 */
export class IncidentCreatedObserver implements IObserver<IncidentCreated> {
  constructor() {
    DomainEvents.subscribeObserver(this, IncidentCreated.eventName)
  }

  async handle(event: IncidentCreated) {
    await pubSub.publish(TOPICS.INCIDENT.CREATED, event)
  }
}
