import { Location } from 'src/shared/domain/models/location'
import { LocationDTO } from '../dtos/location-dto'

export class LocationMapper {
  static fromDomainToDTO(domain: Location): LocationDTO {
    return {
      latitude: domain.latitude,
      longitude: domain.longitude,
    }
  }
}
