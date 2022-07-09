import { GraphQLFieldConfig } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { UserDTO } from 'src/modules/user/adapter/dtos/user-dto'
import { GetUserById } from 'src/modules/user/application/queries'
import { UserType } from '../types/user-type'

export const MeUserQueryType: GraphQLFieldConfig<Record<string, never>, GraphQLContext, any> = {
  type: UserType,
  resolve: async (_, __, ctx): Promise<UserDTO | null> => {
    if (ctx.userId === null) return null
    return GetUserById.gen({ userId: ctx.userId }, ctx)
  },
}
