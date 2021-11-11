import * as redis from 'redis'
import { REDIS_CONN_STRING } from 'src/shared/config'

/**
 * h preffix: hashes (https://redis.io/commands#hash)
 * https://redis.io/topics/data-types-intro
 */
const redisClient = redis.createClient({ url: REDIS_CONN_STRING })

type RedisClient = typeof redisClient

export { redisClient }
export type { RedisClient }
