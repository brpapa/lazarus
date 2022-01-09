import { DeviceModel } from '@prisma/client'
import { Device } from '@notification/domain/models/device'
import { UUID } from '@shared/domain/models/uuid'

export class DeviceMapper {
  static fromPersistenceToDomain(deviceModel: DeviceModel): Device {
    const domain = Device.create(
      { userId: deviceModel.userId, pushToken: deviceModel.pushToken },
      new UUID(deviceModel.id),
    )
    return domain
  }

  static fromDomainToPersistence(domain: Device): DeviceModel {
    return {
      id: domain.id.toString(),
      userId: domain.userId,
      pushToken: domain.pushToken,
    }
  }
}