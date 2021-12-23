import { GraphQLFieldConfig } from 'graphql'
import { GraphQLContext } from 'src/infra/http/graphql/context'
import { UserDTO } from 'src/modules/user/adapter/dtos/user-dto'
import { GetUserById } from 'src/modules/user/application/queries/get-user-by-id'
import { UserType } from '../types/user-type'

export const MeQueryType: GraphQLFieldConfig<void, GraphQLContext, any> = {
  type: UserType,
  resolve: async (_, _args, ctx): Promise<UserDTO | null> => {
    if (ctx.viewer === null) return null
    return GetUserById.gen({ userId: ctx.viewer.id.toString() }, ctx)
  },
}
