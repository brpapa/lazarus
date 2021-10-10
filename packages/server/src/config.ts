import path from 'path'
import dotenvSafe from 'dotenv-safe'

const root = path.join.bind(this, __dirname, '../')

dotenvSafe.config({
  path: root('.env'),
  sample: root('.env.example'),
})

const { env } = process

type NodeEnv = 'development' | 'production'
export const nodeEnv = (env.NODE_ENV || 'production') as NodeEnv

export const graphqlPort = env.GRAPHQL_PORT || 5000
export const jwtSecretKey = env.JWT_SECRET_KEY || 'awesome_secret_key'

const db: Record<NodeEnv, string> = {
  development: env.MONGO_URL || 'mongodb://localhost:27017/database',
  production: env.MONGO_URL || 'mongodb://localhost:27017/database',
}
export const databaseConfig = db[nodeEnv]
