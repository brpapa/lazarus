import { GraphQLObjectType } from 'graphql'
import { offsetToCursor } from 'graphql-relay'
import { UserEdgeType } from '@user/infra/graphql/types/user-type'
import { pubSub, TOPICS } from 'src/api/graphql/pub-sub'

const UserAddedOutputType = new GraphQLObjectType({
  name: 'UserAddedOutput',
  fields: () => ({
    userEdge: {
      type: UserEdgeType,
      resolve: ({ user }) => ({
        cursor: offsetToCursor(user.id),
        node: user,
      }),
    },
  }),
})

export const OnUserAddedSubscriptionType = {
  type: UserAddedOutputType,
  subscribe: () => pubSub.asyncIterator(TOPICS.USER.REGISTERED),
}
