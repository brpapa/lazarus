import { LocationDTO } from '../../../shared/adapter/dtos/location-dto'
import { MediaDTO } from './media-dto'

export interface IncidentDTO {
  incidentId: string
  title: string
  location: LocationDTO
  medias: MediaDTO[]
  createdAt: Date
}
