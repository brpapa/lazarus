import debug from 'debug'
import Expo from 'expo-server-sdk'
import { PushNotificationService } from './push-notification-service'

const log = debug('app:notifications:infra')
const expoClient = new Expo()

export const pushNotificationService = new PushNotificationService(log, expoClient)
