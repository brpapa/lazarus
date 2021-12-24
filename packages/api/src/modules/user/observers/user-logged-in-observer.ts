import { DomainEvents } from 'src/shared/domain/events/domain-events'
import { IObserver } from 'src/shared/domain/events/observer'
import { TOPICS, pubSub } from 'src/infra/graphql/pub-sub'
import { UserLoggedIn } from '../domain/events/user-logged-in'

export class UserLoggedInObserver implements IObserver<UserLoggedIn> {
  constructor() {
    DomainEvents.subscribeObserver(this, UserLoggedIn.eventName)
  }

  handle(e: UserLoggedIn) {
    pubSub.publish(TOPICS.USER.LOGGED_IN, { UserLoggedIn: e.user })
  }
}
