import { DomainError } from 'src/shared/logic/errors'
import { Result, err, ok } from 'src/shared/logic/result/result'
import { ValueObject } from 'src/shared/domain/value-object'

interface UserEmailProps {
  value: string
}

export class UserEmail extends ValueObject<UserEmailProps> {
  get value() { return this.props.value } // prettier-ignore

  private constructor(props: UserEmailProps) {
    super(props)
  }

  public static create(props: UserEmailProps): Result<UserEmail, DomainError> {
    if (!this.isValid(props.value)) return err(new DomainError('Invalid email address'))
    return ok(new UserEmail({ value: this.format(props.value) }))
  }

  private static isValid(email: string) {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(email)
  }

  private static format(email: string) {
    return email.trim().toLowerCase()
  }
}
