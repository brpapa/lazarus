import { LoaderFactory } from '@shared/application/loader-factory'
import { IUserRepo } from '../../adapter/repositories/user-repo'
import { User } from '../../domain/models/user'

export class UserLoaderFactory extends LoaderFactory<User> {
  constructor(incidentRepo: IUserRepo) {
    super(incidentRepo, User.name)
  }
}
