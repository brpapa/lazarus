import { cleanUpDatasources } from 'tests/helpers'
import { IncidentStatus } from '.prisma/client'
import { prismaClient } from '../src/infra/db/prisma/client'
import { connectPrisma, disconnectPrisma } from '../src/infra/db/prisma/connection'

const populate = async () => {
  const alice = await prismaClient.userModel.create({
    data: {
      id: 'alice-01',
      name: 'Alice',
      password: '123',
      phoneNumber: 'alice@prisma.io',
      phoneNumberVerified: false,
      incidents: {
        create: [
          {
            title: 'Check out Prisma with Next.js',
            status: IncidentStatus.ACTIVE,
            coordinateLat: 123,
            coordinateLng: 456,
            statsCommentsCount: 0,
            statsReactionsCount: 0,
            statsUsersNotified: 0,
            statsViewsCount: 0,
          },
        ],
      },
    },
  })
  console.log({ alice })
}

async function main() {
  await connectPrisma()
  await cleanUpDatasources()
  await populate()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await disconnectPrisma()
  })
