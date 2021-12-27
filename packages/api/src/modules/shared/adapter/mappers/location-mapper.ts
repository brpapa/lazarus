import { Location } from 'src/modules/shared/domain/models/location'
import { LocationDTO } from '../dtos/location-dto'

export type LocationRedisModel = { latitude: string; longitude: string }

export class LocationMapper {
  static fromDomainToDTO(domain: Location): LocationDTO {
    return {
      latitude: domain.latitude,
      longitude: domain.longitude,
    }
  }
  static fromPersistenceToDomain(locationModel: LocationRedisModel): Location {
    return Location.create({
      latitude: Number(locationModel.latitude),
      longitude: Number(locationModel.longitude),
    }).asOk()
  }
}
