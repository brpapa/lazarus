export default class Location {
  latitude: number
  longitude: number

  constructor([lat, lng]: [number, number]) {
    this.latitude = lat
    this.longitude = lng
  }
}
