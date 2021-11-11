import { GraphQLObjectType } from 'graphql'
import { offsetToCursor } from 'graphql-relay'
import { UserEdgeType } from 'src/modules/user/infra/http/graphql/types/user'
import { pubSub, events } from 'src/infra/http/graphql/pub-sub'

const UserAddedPayloadType = new GraphQLObjectType({
  name: 'UserAddedPayload',
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

const userAddedSubscription = {
  type: UserAddedPayloadType,
  subscribe: () => pubSub.asyncIterator(events.USER.REGISTERED),
}

export default userAddedSubscription
