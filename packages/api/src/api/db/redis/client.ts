import * as redis from 'redis'
import { DB_CONN_STRING_REDIS } from 'src/config'

/**
 * h preffix: hashes (https://redis.io/commands#hash)
 * https://redis.io/topics/data-types-intro
 */
const redisClient = redis.createClient({ url: DB_CONN_STRING_REDIS })

type RedisClient = typeof redisClient

export { redisClient }
export type { RedisClient }
