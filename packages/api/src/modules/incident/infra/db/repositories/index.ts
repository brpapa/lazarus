import { prismaClient } from 'src/api/db/prisma/client'
import { redisClient } from 'src/api/db/redis/client'
import { CommentRepo } from './comment-repo'
import { IncidentRepo } from './incident-repo'

export const commentRepo = new CommentRepo(prismaClient)
export const incidentRepo = new IncidentRepo(prismaClient, redisClient, commentRepo)
