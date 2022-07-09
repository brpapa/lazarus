import { Debugger } from 'debug'
import { IncidentCreated } from 'src/modules/incident/domain/events/incident-created'
import { DomainEvents } from 'src/modules/shared/domain/events/domain-events'
import { IObserver } from 'src/modules/shared/domain/events/observer'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user-repo'
import { IncidentCreatedEnrichedWithNearbyUsers } from 'src/modules/user/domain/events/incident-created-enriched-with-nearby-users'

/** just dispathes an enriched IncidentCreated event */
export class EnrichIncidentWithNearbyUsersObserver implements IObserver<IncidentCreated> {
  MAX_DISTANCE_INCIDENT_TO_USER_IN_METERS = 4e3 // TODO: max distance possible to of an USER PREFERENCE DISTANCE RADIUS

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

    // TODO: olhar pro distance radius de cada user!

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
