import { Language, LanguageEnum } from '@metis/shared'
import { ValueObject } from 'src/modules/shared/domain/value-object'
import assert from 'assert'

interface UserPreferencesProps {
  radiusDistanceMeters?: number
  language?: Language
}

export class UserPreferences extends ValueObject<UserPreferencesProps> {
  get radiusDistance() { assert(this.props.radiusDistanceMeters !== undefined); return this.props.radiusDistanceMeters } // prettier-ignore
  get language() { assert(this.props.language !== undefined); return this.props.language } // prettier-ignore

  private constructor(props: UserPreferencesProps) {
    super({
      radiusDistanceMeters: props.radiusDistanceMeters || 500,
      language: props.language || LanguageEnum.PT_BR,
    })
  }

  static create(props: UserPreferencesProps): UserPreferences {
    return new UserPreferences(props)
  }
}
