/** CODE DUPLICADED WITH API */
import { getDistance } from 'geolib'

export class DistanceFormatter {
  private static DIST_ACCURACY = 1 // meters accuracy

  static formatGivenPoints(p1: Location, p2: Location): string {
    const dist = getDistance(p1, p2, this.DIST_ACCURACY)
    return this.format(dist)
  }

  /** receives the distance in meters */
  static format(dist: number) {
    if (dist < 1e3) return `${Math.round(dist)} m`
    return `${Math.round(dist / 1e3)} km`
  }
}
