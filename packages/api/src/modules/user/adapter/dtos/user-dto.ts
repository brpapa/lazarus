import { Language } from '@metis/shared'
import { LocationDTO } from '@shared/adapter/dtos/location-dto'

export interface UserDTO {
  userId: string
  username: string
  name: string
  email: string
  preferences: UserPreferencesDTO
  location?: LocationDTO
  avatarUrl?: string
}

export interface UserPreferencesDTO {
  radiusDistance: number
  language: Language
}
