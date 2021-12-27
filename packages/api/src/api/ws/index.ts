import debug from 'debug'
import { ExecutionArgs, getOperationAST, GraphQLError, parse, subscribe, validate } from 'graphql'
import { CloseCode } from 'graphql-ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import http from 'http'
// import { activeUsersRepo } from 'src/modules/notifications/infra/db/repositories'
import { authService } from 'src/modules/user/application/services'
import { WS_GRAPHQL_SUBSCRIPTIONS_PATH } from 'src/config'
import { WebSocketServer } from 'ws'
import { GraphQLContext } from '../graphql/context'
import { createDataLoaders } from '../graphql/loaders'
import { schema } from '../graphql/schema'
import { extractToken, getUserId } from '../utils'

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
      // client 1 <-> 1 ws connection
      onConnect: async (ctx) => {
        // validate jwt token only on connection
        const userId = await getUserId(ctx.connectionParams?.Authorization as string | undefined)
        if (!userId) return ctx.extra.socket.close(CloseCode.Forbidden, 'Forbidden')

        // activeUsersRepo.add(userId)

        log('User %o connected', userId)
        return true
      },
      // client 1 <-> n subscription
      onSubscribe: async (ctx, msg) => {
        const token = extractToken(ctx.connectionParams?.Authorization as string)
        const { userId } = await authService.decodeJwtIgnoringExpiration(token)

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
      // subscription 1 <-> n payload published
      onNext: (_, msg) => {
        log('Publishing payload to the subscription %o', msg.id)
      },
      onError: (_, msg, errors) => {
        log('Error: %O', { msg, errors })
      },
      onClose: async (ctx, code, reason) => {
        const token = extractToken(ctx.connectionParams?.Authorization as string)
        const { userId } = await authService.decodeJwtIgnoringExpiration(token)

        // activeUsersRepo.remove(userId)
        log('User %o connection closed: %O', userId, { code, reason })
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
