import assert from 'assert'
import { AggregateRoot } from 'src/shared/domain/aggregate-root'
import { Location } from 'src/shared/domain/models/location'
import { UUID } from 'src/shared/domain/models/uuid'
import { DomainError } from 'src/shared/logic/errors'
import { Guard } from 'src/shared/logic/guard'
import { combine } from 'src/shared/logic/result'
import { err, ok, Result } from 'src/shared/logic/result/result'
import { UserLoggedIn } from '../events/user-logged-in'
import { UserRegistered } from '../events/user-registered'
import { JwtAccessToken, JwtRefreshToken } from './jwt'
import { UserPassword } from './user-password'
import { UserPhoneNumber } from './user-phone-number'

interface UserProps {
  username: string
  password: UserPassword
  phoneNumber: UserPhoneNumber
  isPhoneNumberVerified?: boolean
  createdAt?: Date
  lastLogin?: Date
  expoPushToken?: string // TODO
  currentLocation?: Location // TODO: props persistida no redis, e preenchida pelo repository ao carregar na aplicacao um usuario existente na base
  // props persistidas no redis, mas repository nao as preenche ao carregar na aplicacao um usuario existente na base
  accessToken?: JwtAccessToken
  refreshToken?: JwtRefreshToken
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

  static create(props: UserProps, id?: UUID): User {
    const user = new User(props, id)

    const isNew = id === undefined
    if (isNew) user.addDomainEvent(new UserRegistered(user))

    return user
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
