import { CoordinateDTO } from '../../../../shared/adapter/dtos/coordinate'

export interface IncidentDTO {
  id: string
  title: string
  coordinate: CoordinateDTO
  createdAt: Date
}
