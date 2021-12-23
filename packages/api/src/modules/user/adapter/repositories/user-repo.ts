import { User } from 'src/modules/user/domain/models/user'
import { IRepository } from 'src/shared/infra/db/repository'

export interface UserWithinCircle {
  user: User
  distanteToCenterInMeters: number
}

export interface IUserRepo extends IRepository<User> {
  findById(id: string): Promise<User | null>
  findByIdBatch(ids: string[]): Promise<User[]>
  findByUsername(username: string): Promise<User | null>
  findAllLocatedWithinCircle(
    centerPoint: { latitude: number; longitude: number },
    radiusInMeters: number,
  ): Promise<UserWithinCircle[]>
  exists(user: User): Promise<boolean>
  delete(user: User): Promise<void>
  commit(user: User): Promise<User>
}
