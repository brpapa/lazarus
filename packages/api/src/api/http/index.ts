import debug from 'debug'
import http from 'http'
import { PORT } from './../../config'
import { app } from './app'

const log = debug('app:infra:http')

/** http for query/mutation graphql operations */
export const initializeHttpServer = () => {
  const httpServer = http.createServer(app.callback())

  return new Promise<http.Server>((res) => {
    httpServer.listen(PORT, () => {
      const httpAddress = httpServer.address() as unknown as { address: string; port: string }
      log('HTTP server started at %o', `http://${httpAddress.address}:${httpAddress.port}`)
      res(httpServer)
    })
  })
}
