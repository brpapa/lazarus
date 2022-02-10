import { Debugger } from 'debug'
import { WithinCircleFilter } from 'src/modules/shared/adapter/dtos/filters'
import { Query } from 'src/modules/shared/logic/query'
import { UserDTO } from 'src/modules/user/adapter/dtos/user-dto'
import { UserMapper } from 'src/modules/user/adapter/mappers/user-mapper'
import { IUserRepo } from 'src/modules/user/adapter/repositories/user-repo'
import { User } from 'src/modules/user/domain/models/user'

export type Input = {
  filter?: {
    withinCircle?: WithinCircleFilter
    exceptUserIds?: string[]
  }
}

export type Res = {
  users: UserDTO[]
  totalCount: number
}

export class UsersQuery extends Query<Input, Res> {
  constructor(log: Debugger, private readonly userRepo: IUserRepo) {
    super(log)
  }

  async execImpl(req: Input): Promise<Res> {
    const users = await this.query(req)
    return {
      users: users.map((user) => UserMapper.fromDomainToDTO(user)),
      totalCount: users.length,
    }
  }

  private query(req: Input): Promise<User[]> {
    if (req.filter?.withinCircle !== undefined) {
      const { center, radiusInMeters } = req.filter.withinCircle
      return this.userRepo
        .findAllLocatedWithinCircle(center, radiusInMeters)
        .then((users) =>
          users
            .map(({ user }) => user)
            .filter((user) =>
              req.filter?.exceptUserIds
                ? !req.filter.exceptUserIds.includes(user.id.toString())
                : true,
            ),
        )
    }

    return this.userRepo.findAll()
  }
}
