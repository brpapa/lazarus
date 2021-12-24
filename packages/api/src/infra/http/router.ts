import Router from 'koa-router'
import { graphqlHttpServer } from './middlewares/graphql'
import uploader from './middlewares/uploader'
import withBatchQuery from './middlewares/with-batch-query'

// declarate routes
const router = new Router()

router.all('/graphql', graphqlHttpServer)
router.all('/graphql/batch', withBatchQuery(graphqlHttpServer))

// to send/receive binary data on demand via stream pipes over http
router.post('/uploads', uploader())
// router.post('/downloads', downloader())

export default router
