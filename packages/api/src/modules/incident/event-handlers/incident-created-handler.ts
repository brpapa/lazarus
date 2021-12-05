import { IncidentCreated } from 'src/modules/incident/domain/events/incident-created'
import { DomainEvents } from 'src/shared/domain/events/domain-events'
import { IHandler } from 'src/shared/domain/events/handler'
import { events, pubSub } from 'src/infra/http/graphql/pub-sub'

export class IncidentCreatedHandler implements IHandler<IncidentCreated> {
  setupSubscriptions() {
    DomainEvents.subscribeEventHandler(this.handle.bind(this), IncidentCreated.constructor.name)
  }

  handle(e: IncidentCreated) {
    pubSub.publish(events.INCIDENT.CREATED, { IncidentCreated: e.incident })
  }
}
