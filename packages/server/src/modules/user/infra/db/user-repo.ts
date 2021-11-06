import { User } from 'src/modules/user/domain/models/user'
import { PrismaRepo } from 'src/shared/infra/db/prisma-repo'
import { IUserRepo } from '../../adaptar/repositories/user'

export class UserRepo extends PrismaRepo<User> implements IUserRepo {
  constructor() {
    super('userModel')
  }

  async findById(id: string): Promise<User> {
    throw new Error('Method not implemented.')
  }
  async findByIdBatch(ids: string[]): Promise<User[]> {
    throw new Error('Method not implemented.')
  }
  async commit(e: User): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
