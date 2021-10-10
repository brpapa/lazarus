import User from '../../domain/entities/user'
import FileRepository from '../../shared/file-repository'

export default class UsersRepository extends FileRepository<User> {
  private static instance: UsersRepository | null = null

  constructor() {
    if (UsersRepository.instance != null) return UsersRepository.instance
    super(User.collection)
    UsersRepository.instance = this
    return this
  }

  public findAll(): User[] {
    const entities = Array.from(this.state.values())
    return entities
  }

  public findOneById(id: string): User | null {
    const entity = this.state.get(id)
    if (!entity) return null
    return entity
  }

  public addOne(entity: User) {
    this.state.set(entity.id, { ...entity })
    this.persistState()
    return this
  }

  public deleteAll() {
    this.state.clear()
    this.persistState()
    return this
  }
}
