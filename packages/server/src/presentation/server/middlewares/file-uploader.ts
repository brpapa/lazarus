import type { Middleware } from 'koa'
import compose from 'koa-compose'

export default (): Middleware =>
  compose([
    (ctx) => {
      ctx.body = 'Hello world!'
    },
  ])
