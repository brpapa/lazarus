import { DomainEvent } from '@shared/domain/events/domain-event'
import { Incident } from './../../../incident/domain/models/incident'

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
