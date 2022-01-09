import assert from 'assert'
import { AggregateRoot } from '@shared/domain/aggregate-root'
import { Location } from '@shared/domain/models/location'
import { UUID } from '@shared/domain/models/uuid'
import { UserRegistered } from '../events/user-registered'
import { UserSignedIn } from '../events/user-signed-in'
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
  location?: Location
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
  get location() { return this.props.location } // prettier-ignore

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

  signIn(accessToken: JwtAccessToken, refreshToken?: JwtRefreshToken, pushToken?: string): void {
    this.addDomainEvent(new UserSignedIn(this, pushToken))
    this.props.accessToken = accessToken
    this.props.refreshToken = refreshToken || this.props.refreshToken
    this.props.lastLogin = new Date()
  }

  updateLocation(newLocation: Location) {
    this.props.location = newLocation
  }
}
