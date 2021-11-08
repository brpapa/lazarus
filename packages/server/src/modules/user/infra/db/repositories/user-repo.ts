import { PrismaClient } from 'src/infra/db/prisma/client'
import { RedisClient } from 'src/infra/db/redis/client'
import { UserMapper } from 'src/modules/user/adapter/mappers/user'
import { User } from 'src/modules/user/domain/models/user'
import { PrismaRepo } from 'src/shared/infra/db/prisma-repo'
import { IUserRepo } from '../../../adapter/repositories/user'

export class UserRepo extends PrismaRepo<User> implements IUserRepo {
  constructor(private prismaClient: PrismaClient, private redisClient: RedisClient) {
    super('userModel')
  }

  async findById(id: string): Promise<User | null> {
    const userModel = await this.prismaClient.userModel.findUnique({ where: { id } })
    return userModel ? UserMapper.fromPersistenceToDomain(userModel) : null
  }

  async findByUsername(username: string): Promise<User | null> {
    const userModel = await this.prismaClient.userModel.findUnique({ where: { username } })
    return userModel ? UserMapper.fromPersistenceToDomain(userModel) : null
  }

  async findByIdBatch(ids: string[]): Promise<User[]> {
    throw new Error('Method not implemented.')
  }

  async commit(e: User): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
