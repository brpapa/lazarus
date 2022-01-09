import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql'
import { globalIdField } from 'graphql-relay'
import { connectionDefinitions } from '@shared/infra/graphql/connections'
import { GraphQLTypes, NodeInterfaceType } from 'src/api/graphql/node'
import { UserDTO } from '@user/adapter/dtos/user-dto'
import { GraphQLContext } from 'src/api/graphql/context'
import { LocationType } from '@shared/infra/graphql/types/location-type'

const USER_TYPE_NAME = 'User'

export const UserType = GraphQLTypes.register(
  new GraphQLObjectType<UserDTO, GraphQLContext>({
    name: USER_TYPE_NAME,
    interfaces: [NodeInterfaceType], // this type implements the Node GraphQL interface
    fields: () => ({
      id: {
        ...globalIdField(USER_TYPE_NAME, (user) => user.userId),
        description: 'The opaque identifier of GraphQL node, based on relay specs',
      },
      userId: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (user) => user.userId,
      },
      username: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (user) => user.username,
      },
      phoneNumber: {
        type: GraphQLNonNull(GraphQLString),
        resolve: (user) => user.phoneNumber,
      },
      location: {
        type: LocationType,
        resolve: (user) => user.location,
      },
    }),
  }),
)

export const { connectionType: UserConnectionType, edgeType: UserEdgeType } = connectionDefinitions(
  {
    name: USER_TYPE_NAME,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    nodeType: GraphQLNonNull(UserType),
  },
)
