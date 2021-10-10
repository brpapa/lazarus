import 'core-js/stable'
import 'regenerator-runtime/runtime'
import app from './presentation/server/app'
import { initialize } from './presentation/server'
import { connectDatabase } from './data/connections/database'
import logger from './shared/logger'

let currentApp = app

if (module.hot) {
  module.hot.accept('./index.js', () => {
    app.removeListener('request', currentApp)
    app.on('request', app)
    currentApp = app
  })
}

async function main() {
  // try {
  //   await connectDatabase()
  // } catch (error) {
  //   logger.error('Could not connect to database', { error })
  //   throw error
  // }

  initialize()
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    // await disconnectDatabase()
  })
