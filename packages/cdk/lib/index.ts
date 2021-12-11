import { App } from '@aws-cdk/core'
import { MetisStack } from './metis-stack'

const app = new App()

new MetisStack(app, 'dev', {
  env: {
    region: 'us-east-1',
  },
})
