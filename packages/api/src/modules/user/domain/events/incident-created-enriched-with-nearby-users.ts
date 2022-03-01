import { DomainEvent } from 'src/modules/shared/domain/events/domain-event'
import { Incident } from 'src/modules/incident/domain/models/incident'

export type NearbyUser = {
  userId: string
  distanceIncidentToUserInMeters: number
}

export class IncidentCreatedEnrichedWithNearbyUsers extends DomainEvent {
  constructor(public incident: Incident, public nearbyUsers: NearbyUser[]) {
    super()
  }

  static get eventName() {
    return IncidentCreatedEnrichedWithNearbyUsers.name
  }
  get eventName() {
    return IncidentCreatedEnrichedWithNearbyUsers.eventName
  }
}
