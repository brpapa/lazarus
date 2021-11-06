import assert from 'assert'
import { Guard } from 'src/shared/logic/guard'
import { DomainError } from 'src/shared/logic/errors'
import { err, ok, Result } from 'src/shared/logic/result/result'
import { AggregateRoot } from 'src/shared/domain/aggregate-root'
import { UUID } from 'src/shared/domain/id'
import { combine } from 'src/shared/logic/result'
import { UserCreated } from '../events/user-created'
import { UserPassword } from './user-password'
import { UserPhoneNumber } from './user-phone-number'

interface UserProps {
  name: string
  password: UserPassword
  phoneNumber: UserPhoneNumber
  isPhoneNumberVerified?: boolean
  createdAt?: Date
}

export class User extends AggregateRoot<UserProps> {
  get name() { return this.props.name } // prettier-ignore
  get password() { return this.props.password } // prettier-ignore
  get phoneNumber() { return this.props.phoneNumber } // prettier-ignore
  get isPhoneNumberVerified() { assert(this.props.isPhoneNumberVerified); return this.props.phoneNumber } // prettier-ignore
  get createdAt() { assert(this.props.createdAt); return this.props.createdAt } // prettier-ignore

  private constructor(props: UserProps, id?: UUID) {
    super(
      {
        ...props,
        isPhoneNumberVerified: props.isPhoneNumberVerified || false,
        createdAt: props.createdAt || new Date(),
      },
      id,
    )
  }

  public static create(props: UserProps, id?: UUID): Result<User, DomainError> {
    const guarded = combine([
      Guard.againstNullOrUndefined(props.firstName, 'firstName'),
      Guard.againstNullOrUndefined(props.lastName, 'lastName'),
    ])
    if (guarded.isErr()) return err(new DomainError(guarded.error))

    const user = new User(props, id)
    const isNew = !!id
    if (isNew) user.addDomainEvent(new UserCreated(user))
    return ok(user)
  }
}
