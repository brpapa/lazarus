import { userSessionRepo } from '../infra/db/repositories'
import { AuthService } from './auth-service'

export const authService = new AuthService(userSessionRepo)
