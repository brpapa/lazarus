import http from 'http'
// TODO: replace by https://github.com/enisdenjo/graphql-ws
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { execute, subscribe } from 'graphql'
import logger from '../../lib/logger'
import { graphqlPort } from '../../config'
import { schema } from '../schema'
import app from './app'

export function initialize() {
  const httpServer = http.createServer(app.callback())

  httpServer.listen(graphqlPort, () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { address, port } = httpServer.address()
    logger.info(`Server started at http://${address}:${port}`)
  })

  SubscriptionServer.create(
    {
      onConnect: (connectionParams: any) => {
        logger.info('Client subscription connected!', connectionParams)
      },
      onDisconnect: () => {
        logger.info('Client subscription disconnected!')
      },
      execute,
      subscribe,
      schema,
    },
    {
      server: httpServer,
      path: '/subscriptions',
    },
  )

  return httpServer
}
