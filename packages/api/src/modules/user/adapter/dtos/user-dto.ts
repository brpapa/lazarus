import { Connection } from 'graphql-relay'
import { Language } from '@metis/shared'
import { LocationDTO } from 'src/modules/shared/adapter/dtos/location-dto'

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

export type UserConnectionDTO = Connection<UserDTO>
