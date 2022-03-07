import { UserModel } from '@prisma/client'
import { PrismaRepo } from 'src/modules/shared/infra/db/prisma-repo'
import { zip } from 'src/modules/shared/logic/helpers/zip'
import { UserMapper } from 'src/modules/user/adapter/mappers/user-mapper'
import { User } from 'src/modules/user/domain/models/user'
import assert from 'assert'
import debug from 'debug'
import { GeoReplyWith, GeoSearchBy } from 'redis/dist/lib/commands/generic-transformers'
import { PrismaClient } from 'src/api/db/prisma/client'
import { RedisClient } from 'src/api/db/redis/client'
import { IUserRepo, UserWithinCircle } from '../../../adapter/repositories/user-repo'

const log = debug('app:user:infra')

export type UserPgModel = UserModel

/**
 * each (userId, location) is persisted on Redis in the following GeoSet data structure:
 *  key: USER_LOCATIONS
 *  value: list of (member, location) pair, where member is the userId
 */
export class UserRepo extends PrismaRepo<User> implements IUserRepo {
  private REDIS_GEO_SET_KEY = 'USER_LOCATIONS'

  constructor(private prismaClient: PrismaClient, private redisClient: RedisClient) {
    super('userModel')
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prismaClient.userModel.findUnique({ where: { id } })
    return this.enrichedWithRedis(user)
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prismaClient.userModel.findUnique({ where: { username } })
    return this.enrichedWithRedis(user)
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prismaClient.userModel.findUnique({ where: { email } })
    return this.enrichedWithRedis(user)
  }

  async findByIdBatch(ids: string[]): Promise<(User | null)[]> {
    const orderedUsers = await this.findByIdBatchOrdered(ids)
    return this.enrichedWithRedisBatch(orderedUsers)
  }

  async findAll(): Promise<User[]> {
    const users = await this.prismaClient.userModel.findMany()
    return this.enrichedWithRedisBatch(users)
  }

  async findAllLocatedWithinCircle(
    centerPoint: { latitude: number; longitude: number },
    radiusInMeters: number,
  ): Promise<UserWithinCircle[]> {
    const byRadius: GeoSearchBy = { radius: radiusInMeters, unit: 'm' }

    const locations = await this.redisClient.geoSearchWith(
      this.REDIS_GEO_SET_KEY,
      centerPoint,
      byRadius,
      [GeoReplyWith.COORDINATES, GeoReplyWith.DISTANCE],
    )
    const usersId = locations.map((v) => v.member)
    const orderedUsers = await this.findByIdBatchOrdered(usersId)

    assert(orderedUsers.length === locations.length)
    return zip(orderedUsers, locations).map(([user, location]) => {
      assert(!!user && !!location)
      assert(user.id.toString() === location.member)
      assert(location.coordinates !== undefined)
      assert(location.distance !== undefined)
      return {
        user: UserMapper.fromModelToDomain(user, location.coordinates),
        distanteToCenterInMeters: Number(location.distance),
      }
    })
  }

  async commit(user: User): Promise<User> {
    const userModel = await UserMapper.fromDomainToModel(user)

    if (user.location !== undefined) {
      const toAdd = {
        member: user.id.toString(), // member is unique in a redis geo set
        latitude: user.location.latitude,
        longitude: user.location.longitude,
      }
      log('Persisting a new or updated (member, location) on Redis: %o', toAdd)
      await this.redisClient.geoAdd(this.REDIS_GEO_SET_KEY, toAdd)
    }

    const isNew = !(await this.exists(user))
    if (isNew) {
      log('Persisting a new user on Pg: %o', user.id.toString())
      await this.prismaClient.userModel.create({ data: userModel })
    } else {
      log('Persisting an updated user on Pg: %o', user.id.toString())
      await this.prismaClient.userModel.update({
        where: { id: user.id.toString() },
        data: userModel,
      })
    }
    return user
  }

  private async findByIdBatchOrdered(ids: string[]) {
    const users = await this.prismaClient.userModel.findMany({ where: { id: { in: ids } } })
    const orderedUsers = ids.map((id) => users.find((v) => v.id === id) ?? null)
    return orderedUsers
  }

  private async enrichedWithRedis(user: UserPgModel | null): Promise<User | null> {
    if (user === null) return null
    return this.enrichedWithRedisBatch([user]).then(([userWithLocation]) => userWithLocation)
  }

  private async enrichedWithRedisBatch(users: (UserPgModel | null)[]): Promise<User[]> {
    if (users.length === 0) return []

    // returns in the same order
    const usersLocations = await this.redisClient.geoPos(
      this.REDIS_GEO_SET_KEY,
      users.map((user) => user?.id || ''),
    )

    assert(users.length === usersLocations.length)
    return zip(users, usersLocations).map(([user, userLocation]) => {
      assert(!!user)
      return UserMapper.fromModelToDomain(user, userLocation ?? null)
    })
  }
}
