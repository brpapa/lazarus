import { PrismaClient } from '@prisma/client'
import { DomainEvents } from 'src/modules/shared/domain/events/domain-events'
import { UUID } from 'src/modules/shared/domain/models/uuid'
import { DB_CONN_STRING_PG } from 'src/config'

const prismaClient = new PrismaClient({
  log: ['error', 'warn'],
  errorFormat: 'pretty',
  datasources: {
    db: {
      url: DB_CONN_STRING_PG,
    },
  },
})

/** dispatch domain events after an aggregate root change is persisted without blocking the execution */
prismaClient.$use(async (params: any, next: any) => {
  const result = await next(params)

  if (mutatingActions.includes(params.action) && typeof result?.id === 'string') {
    const entityId = result.id as string
    DomainEvents.dispatchAllPendingEventsOfAggregate(new UUID(entityId))
  }
  return result
})

// TODO: soft delete: https://www.prisma.io/docs/concepts/components/prisma-client/middleware/soft-delete-middleware
// prisma.$use(async (params, next) => {
//   return await next(params)
// })

const mutatingActions = [
  'create',
  'createMany',
  'update',
  'updateMany',
  'upsert',
  'delete',
  'deleteMany',
  'executeRaw',
]

export { prismaClient, PrismaClient }
