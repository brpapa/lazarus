import { connectPrisma, disconnectPrisma } from './infra/db/prisma/connection'
import { connectRedis, disconnectRedis } from './infra/db/redis/connection'
import { initialize } from './infra/index'

import './modules/incident/observers'
import './modules/user/observers'

async function main() {
  await connectPrisma()
  await connectRedis()
  await initialize()
}

main().catch(async (e) => {
  await disconnectRedis()
  await disconnectPrisma()
  throw e
})
