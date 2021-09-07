import Router from 'koa-router'
import graphqlHttpServer from './middlewares/graphql-http-server'
import fileUploader from './middlewares/file-uploader'
import withBatchQuery from './middlewares/with-batch-query'

// declarate routes
const router = new Router()

router.all('/graphql/batch', withBatchQuery(graphqlHttpServer))
router.all('/graphql', graphqlHttpServer)

router.post('/uploads', fileUploader())

export default router
