import { CoordinateDTO } from './coordinate'

export interface IncidentDTO {
  id: string
  title: string
  coordinate: CoordinateDTO
  createdAt: Date
}
