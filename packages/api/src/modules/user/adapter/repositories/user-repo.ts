import { User } from '@user/domain/models/user'
import { IRepository } from '@shared/infra/db/repository'

export interface UserWithinCircle {
  user: User
  distanteToCenterInMeters: number
}

export interface IUserRepo extends IRepository<User> {
  findById(id: string): Promise<User | null>
  findByIdBatch(ids: string[]): Promise<(User | null)[]>
  findByUsername(username: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAllLocatedWithinCircle(
    centerPoint: { latitude: number; longitude: number },
    radiusInMeters: number,
  ): Promise<UserWithinCircle[]>
  findAll(): Promise<User[]>
  exists(user: User): Promise<boolean>
  delete(user: User): Promise<void>
  commit(user: User): Promise<User>
}
