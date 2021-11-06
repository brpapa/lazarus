import { User } from 'src/modules/user/domain/models/user'
import { IRepository } from '../../../../shared/infra/db/repository'

export interface IUserRepo extends IRepository<User> {
  findById(id: string): Promise<User | null>
  findByIdBatch(ids: string[]): Promise<User[]>
}