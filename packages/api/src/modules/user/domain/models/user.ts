import { AggregateRoot } from 'src/modules/shared/domain/aggregate-root'
import { Location } from 'src/modules/shared/domain/models/location'
import { UUID } from 'src/modules/shared/domain/models/uuid'
import assert from 'assert'
import { UserRegistered } from '../events/user-registered'
import { UserSignedIn } from '../events/user-signed-in'
import { JwtAccessToken, JwtRefreshToken } from './jwt'
import { UserEmail } from './user-email'
import { UserPassword } from './user-password'
import { UserPreferences } from './user-preferences'

interface UserProps {
  username: string
  password: UserPassword
  email: UserEmail
  name: string
  lastLogin?: Date
  location?: Location
  avatarUrl?: string
  preferences?: UserPreferences
  createdAt?: Date
  // props persistidas no redis, mas repository nao as preenche ao carregar na aplicacao um usuario existente na base
  accessToken?: JwtAccessToken
  refreshToken?: JwtRefreshToken
}

export class User extends AggregateRoot<UserProps> {
  get username() { return this.props.username } // prettier-ignore
  get password() { return this.props.password } // prettier-ignore
  get email() { return this.props.email } // prettier-ignore
  get name() { return this.props.name } // prettier-ignore
  get lastLogin() { return this.props.lastLogin } // prettier-ignore
  get location() { return this.props.location } // prettier-ignore
  get avatarUrl() { return this.props.avatarUrl } // prettier-ignore
  get preferences() { assert(this.props.preferences !== undefined); return this.props.preferences } // prettier-ignore
  get createdAt() { assert(this.props.createdAt !== undefined); return this.props.createdAt } // prettier-ignore
  get accessToken() { return this.props.accessToken } // prettier-ignore
  get refreshToken() { return this.props.refreshToken } // prettier-ignore

  private constructor(props: UserProps, id?: UUID) {
    super(
      {
        ...props,
        preferences: props.preferences || UserPreferences.create({}),
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

  updateLastLoginToNow() {
    this.props.lastLogin = new Date()
  }
}
