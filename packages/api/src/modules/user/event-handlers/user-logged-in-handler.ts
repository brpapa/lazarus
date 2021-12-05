import { DomainEvents } from 'src/shared/domain/events/domain-events'
import { IHandler } from 'src/shared/domain/events/handler'
import { events, pubSub } from 'src/infra/http/graphql/pub-sub'
import { UserLoggedIn } from '../domain/events/user-logged-in'

export class UserLoggedInHandler implements IHandler<UserLoggedIn> {
  setupSubscriptions() {
    DomainEvents.subscribeEventHandler(this.handle.bind(this), UserLoggedIn.constructor.name)
  }

  handle(e: UserLoggedIn) {
    pubSub.publish(events.USER.LOGGED_IN, { UserLoggedIn: e.user })
  }
}
