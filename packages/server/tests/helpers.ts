import { redisClient } from 'src/infra/db/redis/client'
import { connectPrisma, disconnectPrisma } from 'src/infra/db/prisma/connection'
import { connectRedis, disconnectRedis } from 'src/infra/db/redis/connection'
import { prismaClient } from 'src/infra/db/prisma/client'
import { IncidentStatus, Prisma } from '.prisma/client'

export const connectDataSources = async () => {
  await connectRedis()
  await connectPrisma()
}
export const disconnectDatasources = async () => {
  await disconnectRedis()
  await disconnectPrisma()
}

export const cleanUpDatasources = async () => {
  await cleanUpRedis()
  await cleanUpPostgres()
}

const cleanUpRedis = async () => {
  await redisClient.flushDb()
}

const cleanUpPostgres = async () => {
  const tables = await prismaClient.$queryRaw<
    { tablename: string }[]
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`

  for await (const { tablename } of tables) {
    if (tablename !== '_prisma_migrations') {
      try {
        await prismaClient.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`)
      } catch (error) {
        console.log({ error })
      }
    }
  }
}

export const createUser = async (userId: string) => {
  await prismaClient.userModel.create({
    data: {
      id: userId,
      username: 'my awesome name',
      password: 'my awesome password',
      phoneNumber: '14 9999999',
      phoneNumberVerified: true,
    },
  })
}

export const createIncident = async (incidentId: string, userId: string) => {
  await prismaClient.incidentModel.create({
    data: {
      id: incidentId,
      title: 'my title',
      coordinateLat: new Prisma.Decimal(1),
      coordinateLng: new Prisma.Decimal(1),
      status: IncidentStatus.ACTIVE,
      statsCommentsCount: 0,
      statsReactionsCount: 0,
      statsViewsCount: 0,
      statsUsersNotified: 0,
      creatorUserId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })
}
