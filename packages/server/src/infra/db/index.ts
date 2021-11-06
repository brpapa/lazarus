import debug from 'debug'
import { prisma } from './prisma/client'

const log = debug('app:db')

export async function connectDatabase() {
  try {
    await prisma.$connect()
    log('database connection has been stablished successfully')
  } catch (error) {
    log('unable to connect to the database', { error })
    throw error
  }
}
