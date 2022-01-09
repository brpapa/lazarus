import { LocationMapper, LocationRedisModel } from '@shared/adapter/mappers/location-mapper'
import { UUID } from '@shared/domain/models/uuid'
import { User } from '@user/domain/models/user'
import { UserPassword } from '@user/domain/models/user-password'
import { UserPhoneNumber } from '@user/domain/models/user-phone-number'
import { UserPgModel } from '../../infra/db/repositories/user-repo'
import { UserDTO } from '../dtos/user-dto'

export class UserMapper {
  static fromDomainToDTO(user: User): UserDTO {
    return {
      userId: user.id.toString(),
      username: user.username,
      phoneNumber: user.phoneNumber.value,
      location:
        user.location !== undefined ? LocationMapper.fromDomainToDTO(user.location) : undefined,
    }
  }

  static fromPersistenceToDomain(
    userModel: UserPgModel,
    userLocationModel: LocationRedisModel | null,
  ): User {
    const user = User.create(
      {
        username: userModel.username,
        password: UserPassword.create({
          value: userModel.password,
          isAlreadyHashed: true,
        }).asOk(),
        location:
          userLocationModel !== null
            ? LocationMapper.fromPersistenceToDomain(userLocationModel)
            : undefined,
        phoneNumber: UserPhoneNumber.create({ value: userModel.phoneNumber }).asOk(),
        isPhoneNumberVerified: userModel.phoneNumberVerified,
        createdAt: userModel.createdAt,
      },
      new UUID(userModel.id),
    )

    return user
  }

  /** to pg model only */
  static async fromDomainToPersistence(domain: User): Promise<UserPgModel> {
    const hashedPassword = await domain.password.getHashedValue()
    return {
      id: domain.id.toString(),
      username: domain.username,
      password: hashedPassword,
      phoneNumber: domain.phoneNumber.value,
      phoneNumberVerified: domain.isPhoneNumberVerified,
      createdAt: domain.createdAt,
    }
  }
}
