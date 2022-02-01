import { LocationDTO } from 'src/modules/shared/adapter/dtos/location-dto'

export interface IGeocodingService {
  fetchFormattedAddress(location: LocationDTO): Promise<string | null>
}
