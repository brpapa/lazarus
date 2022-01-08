import { Entity } from 'src/modules/shared/domain/entity'
import { UUID } from 'src/modules/shared/domain/models/uuid'

interface DeviceProps {
  userId: string
  pushToken: string
}

/**
 * Device that is listening for push notifications
 *
 * user 1 <-> n device
 * device 1 <-> 1 push token
 */
export class Device extends Entity<DeviceProps> {
  get userId() { return this.props.userId } // prettier-ignore
  get pushToken() { return this.props.pushToken } // prettier-ignore

  private constructor(props: DeviceProps, id?: UUID) {
    super(props, id)
  }

  static create(props: DeviceProps, id?: UUID) {
    return new Device(props, id)
  }
}
