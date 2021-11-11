import { PubSub } from 'graphql-subscriptions'

// TODO: colocar variavel dinamica no nome do evento para que somente partes/usuarios interessadas sejam notificadas
export const events = {
  USER: {
    REGISTERED: 'USER:REGISTERED',
    LOGGED_IN: 'USER:LOGGED_IN',
  },
  INCIDENT: {
    CREATED: 'INCIDENT:CREATED',
  },
}

/** a single instance shared between all graphql resolvers */
export const pubSub = new PubSub()
