import { UserModel } from '@prisma/client'
import assert from 'assert'
import debug from 'debug'
import {
  GeoReplyWithMember,
  GeoReplyWith,
  GeoSearchBy,
} from 'redis/dist/lib/commands/generic-transformers'
import { PrismaClient } from 'src/infra/db/prisma/client'
import { RedisClient } from 'src/infra/db/redis/client'
import { UserMapper } from 'src/modules/user/adapter/mappers/user-mapper'
import { User } from 'src/modules/user/domain/models/user'
import { PrismaRepo } from 'src/shared/infra/db/prisma-repo'
import { zip } from 'src/shared/logic/helpers/zip'
import { IUserRepo, UserWithinCircle } from '../../../adapter/repositories/user-repo'

const log = debug('app:user:infra')

export type UserPgModel = UserModel

/**
 * each (userId, location) is persisted on Redis in a GeoSet data structure where:
 *  key: userLocations
 *  value: list of (member, location) pair, where member is the userId
 */
export class UserRepo extends PrismaRepo<User> implements IUserRepo {
  private REDIS_GEO_SET_KEY = 'userLocations'

  constructor(private prismaClient: PrismaClient, private redisClient: RedisClient) {
    super('userModel')
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prismaClient.userModel.findUnique({ where: { id } })
    return this.augmentedWithRedis(user)
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prismaClient.userModel.findUnique({ where: { username } })
    return this.augmentedWithRedis(user)
  }

  async findByIdBatch(ids: string[]): Promise<User[]> {
    const users = await this.prismaClient.userModel.findMany({ where: { id: { in: ids } } })
    return this.augmentedWithRedisBatch(users)
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

    const users = await this.prismaClient.userModel.findMany({
      where: { id: { in: locations.map((i) => i.member) } },
    })

    return zip(users, locations).map(([user, location]) => {
      assert(!!user && !!location)
      assert(user.id.toString() === location.member)
      assert(location.coordinates !== undefined)
      assert(location.distance !== undefined)
      return {
        user: UserMapper.fromPersistenceToDomain(user, location.coordinates),
        distanteToCenterInMeters: location.distance,
      }
    })
  }

  async commit(user: User): Promise<User> {
    const userModel = await UserMapper.fromDomainToPersistence(user)

    if (user.location) {
      // upsert (userId, currentLocation) pair (member is unique in a redis geo set)
      await this.redisClient.geoAdd(this.REDIS_GEO_SET_KEY, {
        member: user.id.toString(),
        latitude: user.location.latitude,
        longitude: user.location.longitude,
      })
    }

    const isNew = !(await this.exists(user))
    if (isNew) {
      log('Persisting a new user: %o', user.id.toString())
      await this.prismaClient.userModel.create({ data: userModel })
    } else {
      log('Persisting an updated user: %o', user.id.toString())
      await this.prismaClient.userModel.update({
        where: { id: user.id.toString() },
        data: userModel,
      })
    }
    return user
  }

  private async augmentedWithRedis(user: UserPgModel | null): Promise<User | null> {
    if (user === null) return null
    return this.augmentedWithRedisBatch([user]).then(([userWithLocation]) => userWithLocation)
  }

  private async augmentedWithRedisBatch(users: UserPgModel[]): Promise<User[]> {
    if (users.length === 0) return []

    const usersLocations = await this.redisClient.geoPos(
      this.REDIS_GEO_SET_KEY,
      users.map((user) => user.id),
    )

    return zip(users, usersLocations).map(([user, userLocation]) => {
      assert(!!user)
      return UserMapper.fromPersistenceToDomain(user, userLocation ?? null)
    })
  }
}
