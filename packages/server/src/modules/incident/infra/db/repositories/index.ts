import { prismaClient } from 'src/infra/db/prisma/client'
import { CommentRepo } from './comment-repo'
import { IncidentRepo } from './incident-repo'

export const commentRepo = new CommentRepo(prismaClient)
export const incidentRepo = new IncidentRepo(prismaClient, commentRepo)
