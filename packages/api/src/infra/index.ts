import { initializeHttpServer } from './http'
import { initializeWebSocketServer } from './ws/index'

export async function initialize() {
  const httpServer = await initializeHttpServer()
  initializeWebSocketServer(httpServer)
}
