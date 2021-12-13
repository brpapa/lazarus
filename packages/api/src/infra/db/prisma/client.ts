import { PrismaClient } from '@prisma/client'
import { DomainEvents } from 'src/shared/domain/events/domain-events'
import { UUID } from 'src/shared/domain/models/uuid'

const prismaClient = new PrismaClient({
  log: ['error', 'warn'],
})

/** dispatch domain events after an aggregate root is persisted */
prismaClient.$use(async (params, next) => {
  const result = await next(params)

  if (mutationActions.includes(params.action) && typeof result?.id === 'string') {
    const entityId = result.id as string
    DomainEvents.dispatchAllPendingEventsOfAggregate(new UUID(entityId))
  }
  return result
})

// TODO: soft delete: https://www.prisma.io/docs/concepts/components/prisma-client/middleware/soft-delete-middleware
// prisma.$use(async (params, next) => {
//   return await next(params)
// })

const mutationActions = [
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
