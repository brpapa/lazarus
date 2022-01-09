import { GraphQLFieldConfig } from 'graphql'
import { GraphQLContext } from 'src/api/graphql/context'
import { UserDTO } from '@user/adapter/dtos/user-dto'
import { GetUserById } from '@user/application/queries/get-user-by-id'
import { UserType } from '../types/user-type'

export const MeQueryType: GraphQLFieldConfig<void, GraphQLContext, any> = {
  type: UserType,
  resolve: async (_, _args, ctx): Promise<UserDTO | null> => {
    if (ctx.userId === null) return null
    return GetUserById.gen({ userId: ctx.userId }, ctx)
  },
}
