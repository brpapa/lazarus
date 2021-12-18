import { IncidentCreated } from 'src/modules/incident/domain/events/incident-created'
import { DomainEvents } from 'src/shared/domain/events/domain-events'
import { IObserver } from 'src/shared/domain/events/observer'
import { events, pubSub } from 'src/infra/http/graphql/pub-sub'

export class IncidentCreatedObserver implements IObserver<IncidentCreated> {
  constructor() {
    DomainEvents.subscribeObserver(this, IncidentCreated.eventName)
  }

  handle(e: IncidentCreated) {
    pubSub.publish(events.INCIDENT.CREATED, { IncidentCreated: e.incident })
  }
}
