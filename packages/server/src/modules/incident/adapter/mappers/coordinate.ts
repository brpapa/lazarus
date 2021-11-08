import { Coordinate } from 'src/shared/domain/models/coordinate'
import { CoordinateDTO } from '../../../../shared/adapter/dtos/coordinate'

export class CoordinateMapper {
  static fromDomainToDTO(domain: Coordinate): CoordinateDTO {
    return {
      latitude: domain.latitude,
      longitude: domain.longitude,
    }
  }
}
