import {UserSignedOut} from 'src/modules/user/domain/events/user-signed-out'
import { DomainEvents } from 'src/modules/shared/domain/events/domain-events'
import { IObserver } from 'src/modules/shared/domain/events/observer'
import { IDeviceRepo } from '../../adapter/device-repo'

/** register user device to receive push notifications */
export class UnregisterDeviceObserver implements IObserver<UserSignedOut> {
  constructor(private deviceRepo: IDeviceRepo) {
    DomainEvents.subscribeObserver(this, UserSignedOut.eventName)
  }

  async handle(event: UserSignedOut) {
    throw new Error('Not implemented yet')
  }
}
