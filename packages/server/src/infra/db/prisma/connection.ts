import debug from 'debug'
import { prismaClient } from './client'

const log = debug('app:db:prisma')

export const connectPrisma = async () => {
  try {
    await prismaClient.$connect()
    log('database connection has been stablished successfully')
  } catch (error) {
    log('unable to connect to the database', { error })
    throw error
  }
}

export const disconnectPrisma = async () => {
  await prismaClient.$disconnect()
}
