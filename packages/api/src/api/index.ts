import { initializeHttpServer } from './http'
import { initializeWebSocketServer } from './ws/index'
import { connectPrisma, disconnectPrisma } from './db/prisma/connection'
import { connectRedis, disconnectRedis } from './db/redis/connection'
import 'src/modules/incident/application/observers'
import 'src/modules/notification/application/observers'
import 'src/modules/user/application/observers'

async function main() {
  await connectPrisma()
  await connectRedis()
  const httpServer = await initializeHttpServer() // http for query/mutation graphql operations
  initializeWebSocketServer(httpServer) // websocket for susbcription graphql operations
}

main().catch(async (e) => {
  await disconnectRedis()
  await disconnectPrisma()
  throw e
})
