import debug from 'debug'
import http from 'http'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { execute, subscribe } from 'graphql'
import { HTTP_PORT, GRAPHQL_SUBSCRIPTIONS_PATH } from 'src/shared/config'
import { schema } from 'src/infra/http/graphql/schema'
import { app } from './app'

const log = debug('app:infra:http')

export function initialize() {
  const httpServer = http.createServer(app.callback())

  httpServer.listen(HTTP_PORT, () => {
    const httpAddress = httpServer.address() as unknown as Address
    log('HTTP server started at %o', `http://${httpAddress.address}:${httpAddress.port}`)

    const wsServer = new WebSocketServer({
      server: httpServer,
      path: GRAPHQL_SUBSCRIPTIONS_PATH,
    })
    useServer(
      {
        schema,
        execute,
        subscribe,
        onConnect: (ctx) => {
          log('client connected: %o', ctx)
        },
        onDisconnect: (ctx) => {
          log('client disconnected: %o', ctx)
        },
        onSubscribe: (ctx, msg) => {
          log('subscribed: %o', { ctx, msg })
        },
        onNext: (ctx, msg, args, result) => {
          log('next: %o', { ctx, msg, args, result })
        },
        onError: (ctx, msg, errors) => {
          log('error: %o', { ctx, msg, errors })
        },
        onComplete: (ctx, msg) => {
          log('completed: %o', { ctx, msg })
        },
      },
      wsServer,
    )

    const wsAddress = wsServer.address() as unknown as Address
    log('WebSocker server started at %o', `http://${wsAddress.address}:${wsAddress.port}`)
  })

  return httpServer
}

type Address = { address: string; port: string }
