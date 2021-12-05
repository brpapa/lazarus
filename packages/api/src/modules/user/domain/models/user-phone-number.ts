import { DomainError } from 'src/shared/logic/errors'
import { err, ok, Result } from 'src/shared/logic/result/result'
import { ValueObject } from 'src/shared/domain/value-object'

interface UserPhoneNumberProps {
  value: string
}

export class UserPhoneNumber extends ValueObject<UserPhoneNumberProps> {
  get value(): string { return this.props.value } // prettier-ignore

  constructor(props: UserPhoneNumberProps) {
    super(props)
  }

  public static create(props: UserPhoneNumberProps): Result<UserPhoneNumber, DomainError> {
    if (!this.isValid(props.value))
      return err(new DomainError(`The phone number ${props.value} is invalid`))
    return ok(new UserPhoneNumber({ value: this.format(props.value) }))
  }

  private static isValid(phoneNumber: string) {
    // TODO: https://www.npmjs.com/package/google-libphonenumber
    return true
  }

  private static format(phoneNumber: string) {
    return phoneNumber.trim()
  }
}
