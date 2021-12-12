import { IncidentCreated } from 'src/modules/incident/domain/events/incident-created'
import { DomainEvents } from 'src/shared/domain/events/domain-events'
import { IHandler } from 'src/shared/domain/events/handler'
import { events, pubSub } from 'src/infra/http/graphql/pub-sub'

export class IncidentCreatedHandler implements IHandler<IncidentCreated> {
  constructor() {
    DomainEvents.subscribeEventHandler(this, IncidentCreated.eventName)
  }

  handle(e: IncidentCreated) {
    pubSub.publish(events.INCIDENT.CREATED, { IncidentCreated: e.incident })
  }
}
