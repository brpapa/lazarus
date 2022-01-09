import { TOPICS, pubSub } from 'src/api/graphql/pub-sub'
import { IncidentCreated } from '@incident/domain/events/incident-created'
import { DomainEvents } from '@shared/domain/events/domain-events'
import { IObserver } from '@shared/domain/events/observer'

/**
 * propagate event to the graphql subscription so active users are updated with the new incident in real time
 */
export class PropagateToSubscriptionObserver implements IObserver<IncidentCreated> {
  constructor() {
    DomainEvents.subscribeObserver(this, IncidentCreated.eventName)
  }

  async handle(event: IncidentCreated) {
    await pubSub.publish(TOPICS.INCIDENT.CREATED, event)
  }
}
