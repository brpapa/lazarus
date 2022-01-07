import { getDistance } from 'geolib'
import { Language, Location } from './../../types'

export class DistanceFormatter {
  private static DIST_ACCURACY = 1 // meters accuracy

  static formatGivenSegment(segment: [Location, Location], lang: Language): string {
    const dist = getDistance(segment[0], segment[1], this.DIST_ACCURACY)
    return this.format(dist, lang)
  }

  /** receives the distance in meters */
  static format(dist: number, lang: Language) {
    const numberFormatter = new Intl.NumberFormat(lang, { maximumFractionDigits: 1 })

    if (dist < 1e3) return `${numberFormatter.format(dist)} m`
    return `${numberFormatter.format(dist / 1e3)} km`
  }
}
