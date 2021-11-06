import debug from 'debug'
import { PrismaClient } from '@prisma/client'
import { DomainEvents } from 'src/shared/domain/events/domain-events'
import { UUID } from 'src/shared/domain/id'

const log = debug('app:db')

const prisma = new PrismaClient({
  log: ['error', 'warn'],
})

// dispatch domain events after a save of an aggregate root entity
prisma.$use(async (params, next) => {
  const result = await next(params)

  if (mutationActions.includes(params.action) && typeof result?.id === 'string') {
    const entityId = result.id as string
    DomainEvents.dispatchEventsOfAggregate(new UUID(entityId))
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

export { prisma }
