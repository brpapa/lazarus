import debug from 'debug'
import { ExecutionArgs, getOperationAST, GraphQLError, parse, subscribe, validate } from 'graphql'
import { CloseCode } from 'graphql-ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import http from 'http'
import { WS_GRAPHQL_SUBSCRIPTIONS_PATH } from 'src/shared/config'
import { WebSocketServer } from 'ws'
import { GraphQLContext } from '../graphql/context'
import { createDataLoaders } from '../graphql/loaders'
import { schema } from '../graphql/schema'
import { getUserId } from '../utils'

const log = debug('app:infra:ws')

/** ws for susbcription graphql operations */
export const initializeWebSocketServer = (httpServer: http.Server) => {
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: WS_GRAPHQL_SUBSCRIPTIONS_PATH,
  })

  useServer(
    {
      schema,
      subscribe,
      onConnect: async (ctx) => {
        const userId = await getUserId(ctx.connectionParams?.Authorization as string | undefined)
        if (!userId) return ctx.extra.socket.close(CloseCode.Forbidden, 'Forbidden')

        log('User connected: %o', userId)
        return true
      },
      // a same client can subscribe to many subscriptions
      onSubscribe: async (ctx, msg) => {
        const userId = await getUserId(ctx.connectionParams?.Authorization as string | undefined)
        if (!userId) return ctx.extra.socket.close(CloseCode.Forbidden, 'Forbidden')

        const context: GraphQLContext = {
          userId,
          request: ctx.extra.request,
          loaders: createDataLoaders(),
        }

        const execArgs: ExecutionArgs = {
          schema,
          operationName: msg.payload.operationName,
          document: parse(msg.payload.query),
          variableValues: msg.payload.variables,
          contextValue: context,
        }

        const operationAST = getOperationAST(execArgs.document, execArgs.operationName)
        if (!operationAST) return [new GraphQLError('Unable to identify operation')]

        if (operationAST.operation !== 'subscription')
          throw new Error('Only subscription operations are supported over WebSocket protocol')

        const errors = validate(execArgs.schema, execArgs.document)
        if (errors.length > 0) return errors // returning GraphQLError[] sends an `ErrorMessage` and stops the subscription

        log(
          'User %o established a subscription to %o with success: %o',
          userId,
          msg.payload.operationName,
          msg.id,
        )
        return execArgs
      },
      onNext: (_, msg) => {
        log('Publishing payload to the subscription %o', msg.id)
      },
      onError: (_, msg, errors) => {
        log('Error: %O', { msg, errors })
      },
      onClose: (_, code, reason) => {
        log('Client connection closed: %O', { code, reason })
      },
    },
    wsServer,
  )

  const wsAddress = wsServer.address() as unknown as { address: string; port: string }
  log(
    'WebSocket server started at %o',
    `ws://${wsAddress.address}:${wsAddress.port}${WS_GRAPHQL_SUBSCRIPTIONS_PATH}`,
  )
}
