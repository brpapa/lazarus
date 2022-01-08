/* eslint-disable @typescript-eslint/no-non-null-assertion */
import path from 'path'
import dotenvSafe from 'dotenv-safe'

const { env } = process

type NodeEnv = 'test' | 'dev' | 'prod'
export const NODE_ENV = (env.NODE_ENV || 'prod') as NodeEnv
export const IS_PRODUCTION = NODE_ENV === 'prod'

const fromRoot = path.join.bind(this, __dirname, '..')
const envFileSuffix = NODE_ENV === 'prod' ? '' : `.${env}`

dotenvSafe.config({
  path: fromRoot(`.env${envFileSuffix}`),
  sample: fromRoot('.env.example'),
})

export type Language = 'en-US' | 'pt-BR'
export const LANGUAGE: Language = 'en-US'

export const API_PORT = env.API_PORT ? Number(env.API_PORT) : 5000
export const WS_GRAPHQL_SUBSCRIPTIONS_PATH = '/graphql/subscriptions'
export const HTTP_GRAPHQL_FORCED_MIN_LATENCY_IN_MS = 1000

export const JWT_SECRET_KEY = env.JWT_SECRET_KEY || 'awesome_secret_key'
export const JWT_ACCESS_TOKEN_EXPIRITY_TIME_IN_S = 86_400 // 1 day
export const JWT_REFRESH_TOKEN_EXPIRITY_TIME_IN_S = 1_296_000 // 15 days

export const DB_CONN_STRING_REDIS = env.DATABASE_REDIS_CONNECTION_STRING!
export const DB_CONN_STRING_PG = env.DATABASE_PG_CONNECTION_STRING!

export const AWS_S3_BUCKET_NAME = 'metis-public-static-content'
export const AWS_REGION = 'us-east-1'
export const AWS_SERVICE_ENDPOINT = undefined
// export const AWS_SERVICE_ENDPOINT = ['test', 'dev'].includes(NODE_ENV)
//   ? 'http://localhost:4566'
//   : undefined
