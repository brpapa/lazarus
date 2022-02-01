import * as redis from 'redis'
import { DB_CONN_STRING_REDIS } from 'src/config'

/**
 * h preffix: hashes (https://redis.io/commands#hash)
 * https://redis.io/topics/data-types-intro
 */
const redisClient = redis.createClient({
  url: DB_CONN_STRING_REDIS,
  socket: DB_CONN_STRING_REDIS.startsWith('rediss://')
    ? {
        tls: true as const,
        // @ts-ignore
        rejectUnauthorized: false,
      }
    : undefined,
})

type RedisClient = typeof redisClient

export { redisClient }
export type { RedisClient }
