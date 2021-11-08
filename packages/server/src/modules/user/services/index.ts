import { redisClient } from 'src/infra/db/redis/client'
import { AuthService } from './auth-service'

export const authService = new AuthService(redisClient)
