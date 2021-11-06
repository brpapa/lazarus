import debug from 'debug'
import http from 'http'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { execute, subscribe } from 'graphql'
import { httpPort, graphqlSubscriptionsPath } from 'src/shared/config'
import { schema } from 'src/infra/http/graphql/schema'
import { app } from './app'

const log = debug('app:http')

export function initialize() {
  const httpServer = http.createServer(app.callback())

  httpServer.listen(httpPort, () => {
    const httpAddress = httpServer.address() as unknown as Address
    log(`HTTP server started at http://${httpAddress.address}:${httpAddress.port}`)

    const wsServer = new WebSocketServer({
      server: httpServer,
      path: graphqlSubscriptionsPath,
    })
    useServer(
      {
        schema,
        execute,
        subscribe,
        onConnect: (ctx) => {
          log('client connected', ctx)
        },
        onDisconnect: (ctx) => {
          log('client disconnected', ctx)
        },
        onSubscribe: (ctx, msg) => {
          log('subscribed', { ctx, msg })
        },
        onNext: (ctx, msg, args, result) => {
          log('next', { ctx, msg, args, result })
        },
        onError: (ctx, msg, errors) => {
          log('error', { ctx, msg, errors })
        },
        onComplete: (ctx, msg) => {
          log('completed', { ctx, msg })
        },
      },
      wsServer,
    )

    const wsAddress = wsServer.address() as unknown as Address
    log(`WebSocket server started at ws://${wsAddress.address}:${wsAddress.port}`)
  })

  return httpServer
}

type Address = { address: string; port: string }
