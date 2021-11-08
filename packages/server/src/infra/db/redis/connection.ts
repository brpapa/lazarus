import debug from 'debug'
import { redisClient } from 'src/infra/db/redis/client'

const log = debug('app:db:redis')

export const connectRedis = async () => {
  try {
    await redisClient.connect()
    log('database connection has been stablished successfully')
  } catch (error) {
    log('unable to connect to the database', { error })
    throw error
  }
}

export const disconnectRedis = async () => {
  // await that pending operations are sent to redis before disconnect it
  await redisClient.quit()
}
