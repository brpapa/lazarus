import debug from 'debug'
import { prismaClient } from './client'

const log = debug('app:infra:db')

export const connectPrisma = async () => {
  try {
    await prismaClient.$connect()
    log('[prisma] database connection has been stablished successfully')
  } catch (error) {
    log('[prisma] unable to connect to the database', { error })
    throw error
  }
}

export const disconnectPrisma = async () => {
  await prismaClient.$disconnect()
}
