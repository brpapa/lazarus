import bodyParser from 'koa-bodyparser'
import { formatError } from 'graphql'
import type { Middleware } from 'koa'
import compose from 'koa-compose'

/**
 * High-order function that wrappers a graphql server middleware to enable batch query, that is, receive many graphql queries at one server hit.
 *
 * Heavy-inspired by: https://github.com/mattecapu/koa-graphql-batch
 */
export default (graphqlHttpServer: Middleware, customFormatErrorFn = formatError): Middleware =>
  compose([
    bodyParser(),
    (ctx, next) => {
      const { response, request } = ctx
      response.type = 'application/json'

      return (
        Promise.all(
          request.body.map((data: any) => {
            // create sub request, response and ctx to fake usual objects for the GraphQL middleware
            const subRequest = Object.setPrototypeOf(
              {
                ...request,
                body: data,
              },
              Object.getPrototypeOf(request),
            )

            const subResponse = Object.setPrototypeOf(
              {
                ...response,
              },
              Object.getPrototypeOf(response),
            )

            const subContext = {
              ...ctx,
              request: subRequest,
              response: subResponse,
              req: subRequest,
              res: subResponse,
            }

            return graphqlHttpServer(subContext, next).then(() => ({
              id: data.id,
              status: subContext.response.status,
              payload: subContext.response.body,
            }))
          }),
        )
          .then((responses) => ({
            // use last given status
            // @ts-ignore
            status: responses.reduce((last, { status }) => status || last, 200),
            // each payload is already a JSON string, so JSON.stringify would not work as intended
            body: `[${responses
              // @ts-ignore
              .map(({ id, payload }) => `{ "id": "${id}", "payload": ${payload} }`)
              .join(', ')}]`,
          }))
          // batching error: return errors
          .catch((error) => ({
            status: 500,
            // @ts-ignore
            body: request.body.map(({ id }) => ({
              id,
              payload: JSON.stringify({
                errors: [customFormatErrorFn(error)],
              }),
            })),
          }))
          .then(({ status, body }) => {
            // @ts-ignore
            response.status = status
            response.body = body
          })
          .then(next)
      )
    },
  ])
