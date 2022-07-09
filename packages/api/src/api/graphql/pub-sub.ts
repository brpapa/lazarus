import { PubSub } from 'graphql-subscriptions'

export const TOPICS = {
  USER: {
    REGISTERED: 'USER:REGISTERED',
    LOGGED_IN: 'USER:LOGGED_IN',
  },
  INCIDENT: {
    CREATED: 'INCIDENT:CREATED',
  },
}

/**
 * a single instance shared between all graphql resolvers
 *
 * As it is an in-memory pubsub, it only works if you have a single instance of your server and doesn't scale beyond a couple of connections. For production usage you'll want to use one of the [PubSub implementations](https://github.com/apollographql/graphql-subscriptions#pubsub-implementations) backed by an external store.
 */
export const pubSub = new PubSub()
