import { LocationDTO } from './location-dto'

export type WithinBoxFilter = {
  northEast: LocationDTO
  southWest: LocationDTO
}
export type WithinCircleFilter = {
  center: LocationDTO
  radiusInMeters: number
}
