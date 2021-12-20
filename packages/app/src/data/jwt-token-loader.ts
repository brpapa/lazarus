import * as SecureStore from 'expo-secure-store'

export class JwtToken {
  static persistenceKey = 'USER_JWT_TOKEN'

  static get() {
    return SecureStore.getItemAsync(this.persistenceKey)
  }

  static set(jwtToken: string) {
    SecureStore.setItemAsync(this.persistenceKey, jwtToken)
  }

  static del() {
    return SecureStore.deleteItemAsync(this.persistenceKey)
  }
}
