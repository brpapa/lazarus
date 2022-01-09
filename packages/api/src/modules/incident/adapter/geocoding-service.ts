import { LocationDTO } from './../../shared/adapter/dtos/location-dto'

export interface IGeocodingService {
  fetchFormattedAddress(location: LocationDTO): Promise<string | null>
}
