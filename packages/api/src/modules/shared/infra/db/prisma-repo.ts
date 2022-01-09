import { Prisma } from '@prisma/client'
import { prismaClient } from 'src/api/db/prisma/client'
import { Entity } from '@shared/domain/entity'

export abstract class PrismaRepo<T extends Entity<any>> {
  constructor(protected modelName: Uncapitalize<Prisma.ModelName>) {}

  async exists(entity: T): Promise<boolean> {
    // @ts-ignore
    const model = await prismaClient[this.modelName].findFirst({
      where: { id: entity.id.toString() },
    })
    return !!model
  }

  async delete(entity: T): Promise<void> {
    // @ts-ignore
    await prismaClient[this.modelName].delete({
      where: { id: entity.id.toString() },
    })
  }
}
