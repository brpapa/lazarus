import { Connection } from 'graphql-relay'
import { MediaDTO } from 'src/modules/incident/adapter/dtos/media-dto'
import { LocationDTO } from 'src/modules/shared/adapter/dtos/location-dto'

export interface IncidentDTO {
  incidentId: string
  ownerUserId: string
  title: string
  location: LocationDTO
  formattedAddress?: string
  medias: MediaDTO[]
  usersNotifiedCount: number
  createdAt: Date
}

export type IncidentConnectionDTO = Connection<IncidentDTO> & {
  totalCount: number
}
