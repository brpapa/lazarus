import { userRepo, userSessionRepo } from '../../infra/db/repositories'
import { AuthService } from './auth-service'
import { LocationService } from './location-service'

export const authService = new AuthService(userSessionRepo)
export const locationService = new LocationService(userRepo)
