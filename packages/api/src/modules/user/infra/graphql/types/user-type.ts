import { GraphQLFloat, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import { globalIdField } from 'graphql-relay'
import { GraphQLContext } from 'src/api/graphql/context'
import { GraphQLTypes, NodeInterfaceType } from 'src/api/graphql/node'
import { connectionDefinitions } from 'src/modules/shared/infra/graphql/connections'
import { LocationType } from 'src/modules/shared/infra/graphql/types/location-type'
import { UserDTO, UserPreferencesDTO } from 'src/modules/user/adapter/dtos/user-dto'
import { LanguageEnumType } from './language-type'

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
        resolve: (user) => user.userId,
        type: GraphQLNonNull(GraphQLString),
      },
      username: {
        resolve: (user) => user.username,
        type: GraphQLNonNull(GraphQLString),
      },
      email: {
        resolve: (user) => user.email,
        type: GraphQLNonNull(GraphQLString),
      },
      name: {
        resolve: (user) => user.name,
        type: GraphQLNonNull(GraphQLString),
      },
      preferences: {
        resolve: (user) => user.preferences,
        type: GraphQLNonNull(
          new GraphQLObjectType<UserPreferencesDTO>({
            name: 'Preferences',
            fields: () => ({
              radiusDistance: {
                type: GraphQLNonNull(GraphQLFloat),
                resolve: (preferences) => preferences.radiusDistance,
              },
              language: {
                type: GraphQLNonNull(LanguageEnumType),
                resolve: (preferences) => preferences.language,
              },
            }),
          }),
        ),
      },
      location: {
        resolve: (user) => user.location,
        type: LocationType,
      },
      avatarUrl: {
        resolve: (user) => user.avatarUrl,
        type: GraphQLString,
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
