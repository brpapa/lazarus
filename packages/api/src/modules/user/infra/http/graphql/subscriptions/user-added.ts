import { GraphQLObjectType } from 'graphql'
import { offsetToCursor } from 'graphql-relay'
import { UserEdgeType } from 'src/modules/user/infra/http/graphql/types/user'
import { pubSub, events } from 'src/infra/http/graphql/pub-sub'

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

export const UserAddedSubscriptionType = {
  type: UserAddedOutputType,
  subscribe: () => pubSub.asyncIterator(events.USER.REGISTERED),
}
