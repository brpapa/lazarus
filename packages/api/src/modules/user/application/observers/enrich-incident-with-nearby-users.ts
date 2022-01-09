import { Debugger } from 'debug'
import { IncidentCreated } from '@incident/domain/events/incident-created'
import { DomainEvents } from '@shared/domain/events/domain-events'
import { IObserver } from '@shared/domain/events/observer'
import { IUserRepo } from '@user/adapter/repositories/user-repo'
import { IncidentCreatedEnrichedWithNearbyUsers } from '@user/domain/events/incident-created-enriched-with-nearby-users'

/** just dispathes an enriched IncidentCreated event */
export class EnrichIncidentWithNearbyUsersObserver implements IObserver<IncidentCreated> {
  MAX_DISTANCE_INCIDENT_TO_USER_IN_METERS = 4e3

  constructor(private log: Debugger, private userRepo: IUserRepo) {
    DomainEvents.subscribeObserver(this, IncidentCreated.eventName)
  }

  async handle({ incident }: IncidentCreated) {
    const nearbyUsers = (
      await this.userRepo.findAllLocatedWithinCircle(
        incident.location,
        this.MAX_DISTANCE_INCIDENT_TO_USER_IN_METERS,
      )
    ).filter((user) => user.user.id.toString() !== incident.ownerUserId.toString())

    this.log(`Found %o users nearby to new incident %o`, nearbyUsers.length, incident.id.toString())

    if (nearbyUsers.length > 0) {
      const incidentCreatedEnrichedWithNearbyUsers = new IncidentCreatedEnrichedWithNearbyUsers(
        incident,
        nearbyUsers.map((nearbyUser) => ({
          userId: nearbyUser.user.id.toString(),
          distanceIncidentToUserInMeters: nearbyUser.distanteToCenterInMeters,
        })),
      )
      await DomainEvents.dispatchEvent(incidentCreatedEnrichedWithNearbyUsers)
    }
  }
}
