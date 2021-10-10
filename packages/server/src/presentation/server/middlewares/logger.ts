// import type { Middleware } from 'koa'
// import morgan from 'morgan'

// export default function logger(): Middleware {
//   const fn = morgan('tiny')
//   return (ctx, next) => {
//     return new Promise((res, rej) => {
//       fn(ctx.req, ctx.res, (err) => (err ? rej(err) : res(ctx)))
//     }).then(next)
//   }
// }
