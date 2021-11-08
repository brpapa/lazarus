import { prismaClient } from 'src/infra/db/prisma/client'
import { redisClient } from 'src/infra/db/redis/client'
import { UserRepo } from './user-repo'

export const userRepo = new UserRepo(prismaClient, redisClient)
