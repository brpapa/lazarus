import debug from 'debug'
import { deviceRepo } from '../../infra/db/repositories'
import { pushNotificationService } from '../../infra/services'
import { NotifyNearbyUsersObserver } from './notify-rearby-users-observer'
import { RegisterDeviceObserver } from './register-device-observer'

const log = debug('app:notifications:application:observer')

new NotifyNearbyUsersObserver(log, deviceRepo, pushNotificationService)
new RegisterDeviceObserver(deviceRepo)
