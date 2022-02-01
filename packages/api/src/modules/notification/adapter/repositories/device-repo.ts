import { Device } from 'src/modules/notification/domain/models/device'

export interface IDeviceRepo {
  findAllOfUser(userId: string): Promise<Device[]>
  findAllOfUserBatch(userIds: string[]): Promise<Device[][]>
  /** not add if the user already have this push token */
  commit(device: Device): Promise<Device>
}
