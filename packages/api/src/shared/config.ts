import path from 'path'
import dotenvSafe from 'dotenv-safe'

const { env } = process

type NodeEnv = 'test' | 'dev' | 'prod'
export const NODE_ENV = (env.NODE_ENV || 'prod') as NodeEnv
export const IS_PRODUCTION = NODE_ENV === 'prod'

const fromRoot = path.join.bind(this, __dirname, '..', '..')
const envFileSuffix = NODE_ENV === 'prod' ? '' : `.${env}`

dotenvSafe.config({
  path: fromRoot(`.env${envFileSuffix}`),
  sample: fromRoot('.env.example'),
})

export const HTTP_PORT = env.HTTP_PORT ? Number(env.HTTP_PORT) : 5000
export const GRAPHQL_SUBSCRIPTIONS_PATH = '/subscriptions'
export const JWT_SECRET_KEY = env.JWT_SECRET_KEY || 'awesome_secret_key'
export const JWT_ACCESS_TOKEN_EXPIRITY_TIME_IN_S = 60 * 5
export const JWT_REFRESH_TOKEN_EXPIRITY_TIME_IN_S = 60 * 6 * 24 * 7
export const REDIS_CONN_STRING = env.DATABASE_REDIS_CONNECTION_STRING || 'redis://localhost:6379'
export const AWS_S3_BUCKET_NAME = 'metis-public-static-content'
export const AWS_REGION = 'us-east-1'
export const AWS_SERVICE_ENDPOINT = undefined
// export const AWS_SERVICE_ENDPOINT = ['test', 'dev'].includes(NODE_ENV)
//   ? 'http://localhost:4566'
//   : undefined