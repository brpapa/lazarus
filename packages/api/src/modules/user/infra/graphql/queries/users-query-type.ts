import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql'
import { Connection, connectionArgs, ConnectionArguments, connectionFromArray } from 'graphql-relay'
import { GraphQLContext } from 'src/api/graphql/context'
import { UserDTO } from 'src/modules/user/adapter/dtos/user-dto'
import { UserMapper } from 'src/modules/user/adapter/mappers/user-mapper'
import { userRepo } from '../../db/repositories'
import { UserConnectionType } from '../types/user-type'

export const UsersQueryType: GraphQLFieldConfig<void, GraphQLContext, any> = {
  type: GraphQLNonNull(UserConnectionType),
  args: connectionArgs,
  resolve: async (_, args: ConnectionArguments): Promise<Connection<UserDTO>> => {
    const users = await userRepo.findAll()
    return connectionFromArray(users.map(UserMapper.fromDomainToDTO), args)
  },
}
