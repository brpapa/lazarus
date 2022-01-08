import { getDistance } from 'geolib'
import { SUPPORTED_LANGUAGES } from './../../config'
import { Language } from './../../types'

const DIST_ACCURACY = 1 // meters accuracy

/** receives the distance in meters */
export const distanceFormatter = (dist: any, lang?: string) => {
  if (!lang || !SUPPORTED_LANGUAGES.includes(lang)) throw new Error(`Unexpected language: ${lang}`)

  if (typeof dist !== 'number')
    throw new Error(`Invalid value object, received: ${JSON.stringify(dist)}`)

  const numberFormatter = new Intl.NumberFormat(lang, { maximumFractionDigits: 1 })

  if (dist < 1e3) return `${numberFormatter.format(dist)} m`
  return `${numberFormatter.format(dist / 1e3)} km`
}

export const distanceFromSegmentFormatter = (segment: any, lang?: string) => {
  if (!lang || !SUPPORTED_LANGUAGES.includes(lang)) throw new Error(`Unexpected language: ${lang}`)

  if (
    segment.constructor.name !== 'Array' &&
    Object.keys(segment) !== ['latitude', 'longitude'] &&
    !Object.values(segment).every((v) => typeof v === 'number')
  )
    throw new Error(`Invalid value object, received: ${JSON.stringify(segment)}`)

  const dist = getDistance(segment[0], segment[1], DIST_ACCURACY)
  return distanceFormatter(dist, lang as Language)
}
