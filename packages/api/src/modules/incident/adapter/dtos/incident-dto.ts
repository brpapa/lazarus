import { LocationDTO } from '@shared/adapter/dtos/location-dto'
import { MediaDTO } from '@incident/adapter/dtos/media-dto'

export interface IncidentDTO {
  incidentId: string
  title: string
  location: LocationDTO
  formattedAddress?: string
  medias: MediaDTO[]
  usersNotified: number
  createdAt: Date
}
