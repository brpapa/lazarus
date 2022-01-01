import debug from 'debug'
import { prismaClient } from 'src/api/db/prisma/client'
import { redisClient } from 'src/api/db/redis/client'
import { CommentRepo } from './comment-repo'
import { IncidentRepo } from './incident-repo'

const log = debug('app:incident:infra')

export const commentRepo = new CommentRepo(log, prismaClient)
export const incidentRepo = new IncidentRepo(log, prismaClient, redisClient, commentRepo)
