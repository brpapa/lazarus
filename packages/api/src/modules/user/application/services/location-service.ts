import debug from 'debug'
import { getDistance } from 'geolib'
import { Incident } from 'src/modules/incident/domain/models/incident'
import { IUserRepo } from '../../adapter/repositories/user-repo'

const log = debug('app:user:services:location')

export class LocationService {
  private DIST_ACCURACY = 1 // meters accuracy
  private MAX_DIST_IN_METERS = 5000 // TODO: read from user.preference.distanceRadius

  constructor(private userRepo: IUserRepo) {}

  async userIsNearbyToIncident(userId: string, incident: Incident): Promise<boolean> {
    const user = await this.userRepo.findById(userId)
    if (!user) {
      log('[warn] User %o not found', userId)
      return false
    }
    if (!user.location) {
      log('[warn] User %o has no location saved yet', userId)
      return false
    }

    const userLocation = { latitude: user.location.latitude, longitude: user.location.longitude }

    const incidentLocation = {
      latitude: incident.location.latitude,
      longitude: incident.location.longitude,
    }

    const dist = getDistance(userLocation, incidentLocation, this.DIST_ACCURACY)

    log('User %o is %o meters away from incident %o', userId, dist, incident.id.toString())

    if (Number.isNaN(dist)) return true
    return dist <= this.MAX_DIST_IN_METERS
  }
}
