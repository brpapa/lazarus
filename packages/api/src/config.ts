/* eslint-disable @typescript-eslint/no-non-null-assertion */
import path from 'path'
import dotenvSafe from 'dotenv-safe'

const { env } = process

type NodeEnv = 'local' | 'test' | 'dev' | 'prod'
export const NODE_ENV = (env.NODE_ENV || 'prod') as NodeEnv
export const IS_PRODUCTION = NODE_ENV === 'prod'

const trimQuotes = (val?: string) => val?.replace(/^"+|'+|"+|'+$/g, '')
const fromRoot = path.join.bind(this, __dirname, '..')

dotenvSafe.config({
  path: fromRoot(`.env.${NODE_ENV}`),
  sample: fromRoot('.env.example'),
})

export const PORT = env.PORT ? Number(env.PORT) : 5555
export const WS_GRAPHQL_SUBSCRIPTIONS_PATH = '/graphql/subscriptions'
export const HTTP_GRAPHQL_FORCED_MIN_LATENCY_ON_DEV_IN_MS = 0

export const JWT_SECRET_KEY = env.JWT_SECRET_KEY || 'awesome_secret_key'
export const JWT_ACCESS_TOKEN_EXPIRITY_TIME_IN_S = 86_400 // 1 day
export const JWT_REFRESH_TOKEN_EXPIRITY_TIME_IN_S = 1_296_000 // 15 days

export const DB_CONN_STRING_REDIS = env.DATABASE_REDIS_CONNECTION_STRING!
export const DB_CONN_STRING_PG = env.DATABASE_PG_CONNECTION_STRING!

export const AWS_S3_BUCKET_NAME = 'public-metis-static-content'
export const AWS_REGION = 'us-east-1'
export const AWS_SERVICE_ENDPOINT = undefined
// export const AWS_SERVICE_ENDPOINT = ['test', 'dev'].includes(NODE_ENV)
//   ? 'http://localhost:4566'
//   : undefined

export const GOOGLE_MAPS_GEOCODING_API_KEY = trimQuotes(env.GOOGLE_MAPS_GEOCODING_API_KEY) ?? null
export const TURN_OFF_GEOCODING_API = !IS_PRODUCTION
