import * as SecureStore from 'expo-secure-store'

export class SecureStoreProxy {
  static accessTokenKey = 'USER_ACCESS_TOKEN'
  static refreshTokenKey = 'USER_REFRESH_TOKEN'

  static async getAccessToken(): Promise<AccessToken | null> {
    const raw = await SecureStore.getItemAsync(this.accessTokenKey)
    if (!raw) return null
    return JSON.parse(raw) as AccessToken
  }

  static async setAccessToken(accessToken: AccessToken | null) {
    if (accessToken === null) {
      await this.delAccessToken()
      return
    }

    const json = JSON.stringify(accessToken)
    await SecureStore.setItemAsync(this.accessTokenKey, json)
  }

  static async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(this.refreshTokenKey)
  }
  static async setRefreshToken(refreshToken: string) {
    await SecureStore.setItemAsync(this.refreshTokenKey, refreshToken)
  }

  private static async delAccessToken() {
    return SecureStore.deleteItemAsync(this.accessTokenKey)
  }
}
