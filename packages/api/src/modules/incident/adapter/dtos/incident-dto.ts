import { CoordinateDTO } from '../../../../shared/adapter/dtos/coordinate-dto'
import { MediaDTO } from './media-dto'

export interface IncidentDTO {
  incidentId: string
  title: string
  coordinate: CoordinateDTO
  medias: MediaDTO[]
  createdAt: Date
}
