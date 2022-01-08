import debug from 'debug'
import { deviceRepo, notificationRepo } from '../../infra/db/repositories'
import { pushNotificationService } from '../../infra/services'
import { NotifyNearbyUsersObserver } from './notify-nearby-users-observer'
import { RegisterDeviceObserver } from './register-device-observer'
import { UnregisterDeviceObserver } from './unregister-device-observer'

const log = debug('app:notifications:application:observer')

new NotifyNearbyUsersObserver(log, deviceRepo, pushNotificationService, notificationRepo)
new RegisterDeviceObserver(deviceRepo)
new UnregisterDeviceObserver(deviceRepo)
