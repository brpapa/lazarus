import 'isomorphic-fetch'
import Koa from 'koa'
import cors from 'kcors'
import logger from 'koa-logger'
import { JWT_SECRET_KEY, NODE_ENV } from 'src/config'
import responseTime from './middlewares/response-time'
import router from './router'

// learn more about KOA with examples: https://github.com/koajs/examples
const app = new Koa()

app.env = NODE_ENV
app.keys = [JWT_SECRET_KEY] // set sessions keys

app.use(responseTime())
app.use(logger()) // log http requests
app.use(cors()) // set `Access-Control-Allow-Origin` header

// mount routes after all
app.use(router.routes())
app.use(router.allowedMethods())

export { app }
