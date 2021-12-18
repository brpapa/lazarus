import { initialize } from './infra/http/index'
import { connectPrisma, disconnectPrisma } from './infra/db/prisma/connection'
import { connectRedis } from './infra/db/redis/connection'

import './modules/incident/observers'
import './modules/user/observers'

async function main() {
  await connectPrisma()
  await connectRedis()
  initialize()
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await disconnectPrisma()
  })
