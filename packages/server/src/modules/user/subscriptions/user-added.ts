import { GraphQLObjectType } from 'graphql'
import { offsetToCursor } from 'graphql-relay'

import { UserConnection } from '../user-type'
import pubSub, { events } from '../../../presentation/pub-sub'

/*
  Resolvers for subscription are slightly different than the ones for queries and mutation:
    - Rather than returning any data directly, they return an AsyncIterator which subsequently is used by the GraphQL server to push the event data to the client.
    - Subscription resolvers are wrapped inside an object and need to be provided as the value for a subscribe field. You also need to provide another field called resolve that actually returns the data from the data emitted by the AsyncIterator.
*/

const UserAddedPayloadType = new GraphQLObjectType({
  name: 'UserAddedPayload',
  fields: () => ({
    userEdge: {
      type: UserConnection.edgeType,
      resolve: ({ user }) => ({
        cursor: offsetToCursor(user.id),
        node: user,
      }),
    },
  }),
})

const userAddedSubscription = {
  type: UserAddedPayloadType,
  subscribe: () => pubSub.asyncIterator(events.USER.ADDED),
}

export default userAddedSubscription
