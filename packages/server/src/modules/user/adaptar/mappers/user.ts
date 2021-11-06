import { UserPhoneNumber } from 'src/modules/user/domain/models/user-phone-number'
import { UserPassword } from 'src/modules/user/domain/models/user-password'
import { User } from 'src/modules/user/domain/models/user'
import { UserModel } from '@prisma/client'
import { UUID } from 'src/shared/domain/id'

export class UserMapper {
  static fromPersistenceToDomain(model: UserModel): User {
    const user = User.create(
      {
        name: model.name,
        password: UserPassword.create({
          value: model.password,
          isAlreadyHashed: true,
        }).asOk(),
        phoneNumber: UserPhoneNumber.create({ value: model.phoneNumber }).asOk(),
        isPhoneNumberVerified: model.phoneNumberVerified,
        createdAt: model.createdAt,
      },
      new UUID(model.id),
    ).asOk()

    return user
  }
  static async fromDomainToPersistence(domain: User): Promise<UserModel> {
    const hashedPassword = await domain.password.getHashedValue()
    return {
      id: domain.id.toString(),
      name: domain.name,
      password: hashedPassword,
      phoneNumber: domain.phoneNumber.value,
      phoneNumberVerified: false,
      createdAt: new Date(),
    }
  }
}
