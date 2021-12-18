import debug from 'debug'
import { PrismaClient } from 'src/infra/db/prisma/client'
import { RedisClient } from 'src/infra/db/redis/client'
import { UserMapper } from 'src/modules/user/adapter/mappers/user-mapper'
import { User } from 'src/modules/user/domain/models/user'
import { PrismaRepo } from 'src/shared/infra/db/prisma-repo'
import { IUserRepo } from '../../../adapter/repositories/user-repo'

const log = debug('app:user:infra')

// TODO: gravar no redis a location do usuario, e retornar nos gets
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

  async findManyByIds(ids: string[]): Promise<User[]> {
    const userModels = await this.prismaClient.userModel.findMany({ where: { id: { in: ids } } })
    return userModels.map((userModel) => UserMapper.fromPersistenceToDomain(userModel))
  }

  async commit(user: User): Promise<User> {
    try {
      const userModel = await UserMapper.fromDomainToPersistence(user)

      const isNew = !(await this.exists(user))
      if (isNew) {
        log('Persisting a new user: %o', user.id.toString())
        await this.prismaClient.userModel.create({ data: userModel })
      } else {
        log('Persisting an updated user: %o', user.id.toString())
        await this.prismaClient.incidentModel.update({
          where: { id: user.id.toString() },
          data: userModel,
        })
      }
      return user
    } catch (e) {
      log('Unexpected error: %O', e)
      throw e
    }
  }
}
