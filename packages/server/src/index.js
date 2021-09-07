import 'core-js/stable'
import 'regenerator-runtime/runtime'
import app from './presentation/server/app'
import { initialize } from './presentation/server'
// import { connectDatabase } from './database'

let currentApp = app

if (module.hot) {
  module.hot.accept('./index.js', () => {
    app.removeListener('request', currentApp)
    app.on('request', app)
    currentApp = app
  })
}

async function bootstrap() {
  // try {
  //   await connectDatabase()
  // } catch (error) {
  //   logger.error('Could not connect to database', { error })
  //   throw error
  // }

  initialize()
}

bootstrap()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    // await disconnectDatabase()
  })
