import { GraphQLContext } from 'src/infra/graphql/context'
import { User } from 'src/modules/user/domain/models/user'
import { UserDTO } from '../../adapter/dtos/user-dto'
import { UserMapper } from '../../adapter/mappers/user-mapper'

export class GetUserById {
  static async gen(args: { userId: string }, ctx: GraphQLContext): Promise<UserDTO | null> {
    const user = await ctx.loaders.user.load(args.userId)
    return this.canSee(ctx.userId) ? UserMapper.fromDomainToDTO(user) : null
  }

  // permissions and authorizations lives here
  private static canSee(_userId: string | null) {
    return true
  }
}
