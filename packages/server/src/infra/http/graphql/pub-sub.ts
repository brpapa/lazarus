import { PubSub } from 'graphql-subscriptions'

export const events = {
  USER: {
    ADDED: 'USER:ADDED',
  },
  INCIDENT: {
    CREATED: 'INCIDENT:CREATED',
  },
}

/** a single instance shared between all graphql resolvers */
export const pubSub = new PubSub()
