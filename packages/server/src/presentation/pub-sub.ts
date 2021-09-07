import { PubSub } from 'graphql-subscriptions'

export const events = {
  USER: {
    ADDED: 'USER_ADDED',
  },
}

export default new PubSub()
