import { DomainEvents } from 'src/modules/shared/domain/events/domain-events'
import { IObserver } from 'src/modules/shared/domain/events/observer'
import { UserSignedIn } from '../../../user/domain/events/user-signed-in'
import { IDeviceRepo } from '../../adapter/repositories/device-repo'
import { Device } from '../../domain/models/device'

/** register user device to receive push notifications */
export class RegisterDeviceObserver implements IObserver<UserSignedIn> {
  constructor(private deviceRepo: IDeviceRepo) {
    DomainEvents.subscribeObserver(this, UserSignedIn.eventName)
  }

  async handle(event: UserSignedIn) {
    if (event.pushToken) {
      const device = Device.create({
        userId: event.user.id.toString(),
        pushToken: event.pushToken,
      })
      await this.deviceRepo.commit(device)
    }
  }
}
