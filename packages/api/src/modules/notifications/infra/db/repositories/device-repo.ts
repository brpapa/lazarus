import { PrismaClient } from '@prisma/client'
import { Debugger } from 'debug'
import { IDeviceRepo } from 'src/modules/notifications/adapter/device-repo'
import { DeviceMapper } from 'src/modules/notifications/adapter/mappers/device-mapper'
import { Device } from 'src/modules/notifications/domain/models/device'
import { PrismaRepo } from 'src/modules/shared/infra/db/prisma-repo'

export class DeviceRepo extends PrismaRepo<Device> implements IDeviceRepo {
  constructor(private log: Debugger, private prismaClient: PrismaClient) {
    super('deviceModel')
  }

  async findAllOfUser(userId: string): Promise<Device[]> {
    const devices = await this.prismaClient.deviceModel.findMany({ where: { userId } })
    return devices.map(DeviceMapper.fromPersistenceToDomain)
  }

  async findAllOfUserBatch(userIds: string[]): Promise<Device[][]> {
    const devices = await this.prismaClient.deviceModel.findMany({
      where: { userId: { in: userIds } },
    })
    const usersDevices = userIds.map((userId) =>
      devices.filter((d) => d.userId === userId).map(DeviceMapper.fromPersistenceToDomain),
    )
    return usersDevices
  }

  async commit(device: Device) {
    const deviceModel = DeviceMapper.fromDomainToPersistence(device)

    const previousDevicesOfUser = await this.findAllOfUser(device.userId.toString())
    if (previousDevicesOfUser.some(({ pushToken }) => pushToken === device.pushToken)) {
      this.log(
        'Ignoring commit because the user %o already have a device with pushToken %o',
        device.userId.toString(),
        device.pushToken,
      )
      return device
    }

    const isNew = !(await this.exists(device))
    if (isNew) {
      this.log('Persisting a new device on Pg: %o', device.id.toString())
      await this.prismaClient.deviceModel.create({ data: deviceModel })
    } else {
      this.log('Persisting an updated device on Pg: %o', device.id.toString())
      await this.prismaClient.deviceModel.update({
        where: { id: device.id.toString() },
        data: deviceModel,
      })
    }

    return device
  }
}
