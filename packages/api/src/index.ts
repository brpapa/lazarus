import { prismaClient } from './infra/db/prisma/client'
import { initialize } from './infra/http/index'
import { connectPrisma } from './infra/db/prisma/connection'
import { connectRedis } from './infra/db/redis/connection'

import './modules/incident/event-handlers'
import './modules/user/event-handlers'

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
    await prismaClient.$disconnect()
  })