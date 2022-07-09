import { prismaClient } from 'src/api/db/prisma/client'
import { redisClient } from 'src/api/db/redis/client'
import { UserSessionRepo } from './user-session-repo'
import { UserRepo } from './user-repo'

export const userRepo = new UserRepo(prismaClient, redisClient)
export const userSessionRepo = new UserSessionRepo(redisClient)
