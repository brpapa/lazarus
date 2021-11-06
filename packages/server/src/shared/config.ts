import path from 'path'
import dotenvSafe from 'dotenv-safe'

const { env } = process

type NodeEnv = 'test' | 'dev' | 'prod'
export const nodeEnv = (env.NODE_ENV || 'prod') as NodeEnv

const fromRoot = path.join.bind(this, __dirname, '..', '..')
const fileSuffix = nodeEnv === 'prod' ? '' : `.${env}`

dotenvSafe.config({
  path: fromRoot(`.env${fileSuffix}`),
  sample: fromRoot('.env.example'),
})

export const isProduction = () => nodeEnv === 'prod'

export const httpPort = env.HTTP_PORT ? Number(env.HTTP_PORT) : 5000
export const graphqlSubscriptionsPath = '/subscriptions'
export const jwtSecretKey = env.JWT_SECRET_KEY || 'awesome_secret_key'
