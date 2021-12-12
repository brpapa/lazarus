import debug from 'debug'
import assert from 'assert'
import { Guard } from 'src/shared/logic/guard'
import { DomainError } from 'src/shared/logic/errors'
import { err, ok, Result } from 'src/shared/logic/result/result'
import { AggregateRoot } from 'src/shared/domain/aggregate-root'
import { UUID } from 'src/shared/domain/models/uuid'
import { combine } from 'src/shared/logic/result'
import { Coordinate } from 'src/shared/domain/models/coordinate'
import { UserRegistered } from '../events/user-registered'
import { UserPassword } from './user-password'
import { UserPhoneNumber } from './user-phone-number'
import { JwtAccessToken, JwtRefreshToken } from './jwt'
import { UserLoggedIn } from '../events/user-logged-in'

const log = debug('app:user:domain')

interface UserProps {
  username: string
  password: UserPassword
  phoneNumber: UserPhoneNumber
  isPhoneNumberVerified?: boolean
  createdAt?: Date
  lastLogin?: Date
  // TODO: props persistida no redis, e preenchida pelo repo ao carregar um usuario existente
  currentLocation?: Coordinate
  // props persistidas no redis, mas repo nao as preenche ao carregar um usuario existente
  accessToken?: JwtAccessToken
  refreshToken?: JwtAccessToken
}

export class User extends AggregateRoot<UserProps> {
  get username() { return this.props.username } // prettier-ignore
  get password() { return this.props.password } // prettier-ignore
  get phoneNumber() { return this.props.phoneNumber } // prettier-ignore
  get isPhoneNumberVerified() { assert(this.props.isPhoneNumberVerified !== undefined); return this.props.isPhoneNumberVerified } // prettier-ignore
  get createdAt() { assert(this.props.createdAt); return this.props.createdAt } // prettier-ignore
  get lastLogin() { return this.props.lastLogin } // prettier-ignore
  get accessToken() { return this.props.accessToken } // prettier-ignore
  get refreshToken() { return this.props.refreshToken } // prettier-ignore
  get currentLocation() { return this.props.currentLocation } // prettier-ignore

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

  static create(props: UserProps, id?: UUID): Result<User, DomainError> {
    const guarded = combine([Guard.againstNullOrUndefined(props.username, 'name')])
    if (guarded.isErr()) return err(new DomainError(guarded.error))

    const user = new User(props, id)
    const isNew = !!id
    if (isNew) user.addDomainEvent(new UserRegistered(user))

    log(`User created: ${user.id}`)

    return ok(user)
  }

  isAuthenticated() {
    return !!this.accessToken && !!this.refreshToken
  }

  setTokens(accessToken: JwtAccessToken, refreshToken?: JwtRefreshToken): void {
    this.addDomainEvent(new UserLoggedIn(this))
    this.props.accessToken = accessToken
    this.props.refreshToken = refreshToken || this.props.refreshToken
    this.props.lastLogin = new Date()
  }
}
