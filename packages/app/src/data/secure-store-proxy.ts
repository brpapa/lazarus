import * as SecureStore from 'expo-secure-store'

export class SecureStoreProxy {
  static persistenceKey = 'USER_ACCESS_TOKEN'

  static async getAccessToken(): Promise<AccessToken | null> {
    const raw = await SecureStore.getItemAsync(this.persistenceKey)
    if (!raw) return null
    return JSON.parse(raw) as AccessToken
  }

  static async setAccessToken(accessToken: AccessToken | null) {
    if (accessToken === null) {
      await this.del()
      return
    }

    const json = JSON.stringify(accessToken)
    await SecureStore.setItemAsync(this.persistenceKey, json)
  }

  private static async del() {
    return SecureStore.deleteItemAsync(this.persistenceKey)
  }
}

/*
// 📺 client

import { createClient, CloseCode } from 'graphql-ws'
import {
  getCurrentToken,
  getCurrentTokenExpiresIn,
  refreshCurrentToken,
} from './my-auth'

// non-fatal WebSocket connection close events will cause the
// client to automatically reconnect. the retries are silent, meaning
// that the client will not error out unless the retry attempts have been
// exceeded or the close event was fatal (read more about the fatal
// close events in the documentation). additionally, all active subscriptions
// will automatically resubscribe upon successful reconnect. this behaviour
// can be leveraged to implement a secure and sound way of authentication;
// handling server-side validation, expiry indication and timely token refreshes

// indicates that the server closed the connection because of
// an auth problem. it indicates that the token should refresh
let shouldRefreshToken = false,
  // the socket close timeout due to token expiry
  tokenExpiryTimeout = null

const client = createClient({
  url: 'ws://server-validates.auth:4000/graphql',
  connectionParams: async () => {
    if (shouldRefreshToken) {
      // refresh the token because it is no longer valid
      await refreshCurrentToken()
      // and reset the flag to avoid refreshing too many times
      shouldRefreshToken = false
    }
    return { token: getCurrentToken() }
  },
  on: {
    connected: (socket) => {
      // clear timeout on every connect for debouncing the expiry
      clearTimeout(tokenExpiryTimeout)

      // set a token expiry timeout for closing the socket
      // with an `4403: Forbidden` close event indicating
      // that the token expired. the `closed` event listner below
      // will set the token refresh flag to true
      tokenExpiryTimeout = setTimeout(() => {
        if (socket.readyState === WebSocket.OPEN)
          socket.close(CloseCode.Forbidden, 'Forbidden')
      }, getCurrentTokenExpiresIn())
    },
    closed: (event) => {
      // if closed with the `4403: Forbidden` close event
      // the client or the server is communicating that the token
      // is no longer valid and should be therefore refreshed
      if (event.code === CloseCode.Forbidden) shouldRefreshToken = true
    },
  },
})

*/
