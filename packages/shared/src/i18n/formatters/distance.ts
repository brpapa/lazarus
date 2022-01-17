import { getDistance } from 'geolib'
import { SUPPORTED_LANGUAGES } from './../../config'
import { Language, Location } from './../../types'

const DIST_ACCURACY = 1 // meters accuracy

/** receives the distance in meters */
export const distanceFormatter = (value: any, lang?: string) => {
  if (!lang || !SUPPORTED_LANGUAGES.includes(lang)) throw new Error(`Unexpected language: ${lang}`)

  if (typeof value !== 'number')
    throw new Error(`Invalid value object, received: ${JSON.stringify(value)}`)

  const dist = value as number
  const numberFormatter = new Intl.NumberFormat(lang, { maximumFractionDigits: 1 })

  if (dist < 1e3) return `${numberFormatter.format(dist)} m`
  return `${numberFormatter.format(dist / 1e3)} km`
}

export const distanceFromSegmentFormatter = (value: any, lang?: string) => {
  if (!lang || !SUPPORTED_LANGUAGES.includes(lang)) throw new Error(`Unexpected language: ${lang}`)

  if (
    value.constructor.name !== 'Array' &&
    Object.keys(value) !== ['latitude', 'longitude'] &&
    !Object.values(value).every((v) => typeof v === 'number')
  )
    throw new Error(`Invalid value object, received: ${JSON.stringify(value)}`)

  const segment = value as [Location, Location]
  const dist = getDistance(segment[0], segment[1], DIST_ACCURACY)
  return distanceFormatter(dist, lang as Language)
}
