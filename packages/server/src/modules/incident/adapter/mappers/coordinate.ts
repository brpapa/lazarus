import { Coordinate } from 'src/modules/incident/domain/models/coordinate'
import { CoordinateDTO } from '../dtos/coordinate'

export class LocationMapper {
  static fromDomainToDTO(domain: Coordinate): CoordinateDTO {
    return {
      latitude: domain.latitude,
      longitude: domain.longitude,
    }
  }
}
