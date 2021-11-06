import { prisma } from './infra/db/prisma/client'
import { initialize } from './infra/http/index'
import { connectDatabase } from './infra/db/index'

import './modules/incident/event-handlers'

async function main() {
  connectDatabase()
  initialize()
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
