import { CoordinateDTO } from '../../../../shared/adapter/dtos/coordinate'
import { MediaDTO } from './media'

export interface IncidentDTO {
  id: string
  title: string
  coordinate: CoordinateDTO
  medias: MediaDTO[]
  createdAt: Date
}
