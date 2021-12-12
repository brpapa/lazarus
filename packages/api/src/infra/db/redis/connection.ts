import debug from 'debug'
import { redisClient } from 'src/infra/db/redis/client'

const log = debug('app:infra:db')

export const connectRedis = async () => {
  try {
    await redisClient.connect()
    // await redisClient.scriptLoad('geo.lua')
    log('[redis] database connection has been stablished successfully')
  } catch (error) {
    log('[redis] unable to connect to the database', { error })
    throw error
  }
}

export const disconnectRedis = async () => {
  // await that pending operations are sent to redis before disconnect it
  await redisClient.quit()
}
