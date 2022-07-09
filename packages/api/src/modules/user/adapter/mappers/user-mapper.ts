import { LANGUAGE, Language, LanguageEnum } from '@lazarus/shared'
import { LocationMapper, LocationRedisModel } from 'src/modules/shared/adapter/mappers/location-mapper'
import { UUID } from 'src/modules/shared/domain/models/uuid'
import { UserDTO } from 'src/modules/user/adapter/dtos/user-dto'
import { User } from 'src/modules/user/domain/models/user'
import { UserEmail } from 'src/modules/user/domain/models/user-email'
import { UserPassword } from 'src/modules/user/domain/models/user-password'
import { UserPgModel } from 'src/modules/user/infra/db/repositories/user-repo'
import { UserPreferences } from '../../domain/models/user-preferences'

export class UserMapper {
  static fromDomainToDTO(user: User): UserDTO {
    return {
      userId: user.id.toString(),
      username: user.username,
      email: user.email.value,
      name: user.name,
      avatarUrl: user.avatarUrl,
      preferences: {
        radiusDistance: user.preferences.radiusDistance,
        language: user.preferences.language,
      },
      location:
        user.location !== undefined ? LocationMapper.fromDomainToDTO(user.location) : undefined,
    }
  }

  static fromModelToDomain(
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
        email: UserEmail.create({ value: userModel.email }).asOk(),
        name: userModel.name,
        preferences: UserPreferences.create({
          radiusDistanceMeters: userModel.preferencesRadiusDistance,
          language: (() => {
            const matchedLang = Object.values(LanguageEnum).find(
              (lang) => lang === userModel.preferencesLanguage,
            )
            if (!matchedLang)
              throw new Error(
                `The received userModel.preferencesLanguage '${
                  userModel.preferencesLanguage
                }' is not some of ${Object.values(LanguageEnum)}`,
              )
            return matchedLang
          })(),
        }),
        location:
          userLocationModel !== null
            ? LocationMapper.fromModelToDomain(userLocationModel)
            : undefined,
        avatarUrl: userModel.avatarUrl ?? undefined,
        createdAt: userModel.createdAt,
      },
      new UUID(userModel.id),
    )

    return user
  }

  /** to pg model only */
  static async fromDomainToModel(domain: User): Promise<UserPgModel> {
    const hashedPassword = await domain.password.getHashedValue()
    return {
      id: domain.id.toString(),
      username: domain.username,
      password: hashedPassword,
      email: domain.email.value,
      name: domain.name,
      preferencesLanguage: domain.preferences.language,
      preferencesRadiusDistance: domain.preferences.radiusDistance,
      avatarUrl: domain.avatarUrl ?? null,
      createdAt: domain.createdAt,
    }
  }
}
