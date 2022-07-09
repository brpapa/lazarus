import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql'
import { connectionArgs, ConnectionArguments, connectionFromArray } from 'graphql-relay'
import { GraphQLContext } from 'src/api/graphql/context'
import { UserConnectionDTO } from 'src/modules/user/adapter/dtos/user-dto'
import { usersQuery } from 'src/modules/user/application/queries'
import { UserConnectionType } from '../types/user-type'

export const UsersQueryType: GraphQLFieldConfig<void, GraphQLContext, any> = {
  type: GraphQLNonNull(UserConnectionType),
  args: connectionArgs,
  resolve: async (_, args: ConnectionArguments, ctx): Promise<UserConnectionDTO> => {
    const { users } = await usersQuery.exec({}, ctx)
    const connection = connectionFromArray(users, args)
    return connection
  },
}
