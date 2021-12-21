import { UserPhoneNumber } from 'src/modules/user/domain/models/user-phone-number'
import { UserPassword } from 'src/modules/user/domain/models/user-password'
import { User } from 'src/modules/user/domain/models/user'
import { UserModel } from '@prisma/client'
import { UUID } from 'src/shared/domain/models/uuid'
import { UserDTO } from '../dtos/user-dto'

export class UserMapper {
  static fromDomainToDTO(user: User): UserDTO {
    return {
      userId: user.id.toString(),
      username: user.username,
      phoneNumber: user.phoneNumber.value,
    }
  }

  static fromPersistenceToDomain(model: UserModel): User {
    const user = User.create(
      {
        username: model.username,
        password: UserPassword.create({
          value: model.password,
          isAlreadyHashed: true,
        }).asOk(),
        phoneNumber: UserPhoneNumber.create({ value: model.phoneNumber }).asOk(),
        isPhoneNumberVerified: model.phoneNumberVerified,
        createdAt: model.createdAt,
      },
      new UUID(model.id),
    )

    return user
  }

  static async fromDomainToPersistence(domain: User): Promise<UserModel> {
    const hashedPassword = await domain.password.getHashedValue()
    return {
      id: domain.id.toString(),
      username: domain.username,
      password: hashedPassword,
      phoneNumber: domain.phoneNumber.value,
      phoneNumberVerified: domain.isPhoneNumberVerified,
      createdAt: new Date(),
    }
  }
}
