import * as SecureStore from 'expo-secure-store'

export class SecureStoreProxy {
  private static accessTokenKey = 'USER_ACCESS_TOKEN'
  private static refreshTokenKey = 'USER_REFRESH_TOKEN'

  static async getAccessToken(): Promise<AccessToken | null> {
    const raw = await SecureStore.getItemAsync(this.accessTokenKey)
    if (!raw) return null

    const obj = JSON.parse(raw)
    if (typeof obj?.value !== 'string') throw new Error('value should be string')
    if (typeof obj?.expiresIn !== 'string') throw new Error('expiresIn should be string')

    return {
      value: obj.value,
      expiresIn: new Date(obj.expiresIn),
    }
  }

  static async setAccessToken(accessToken: AccessToken | null) {
    if (accessToken === null) return this.deleteAccessToken()

    const json = JSON.stringify(accessToken)
    await SecureStore.setItemAsync(this.accessTokenKey, json)
  }

  static async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(this.refreshTokenKey)
  }

  static async setRefreshToken(refreshToken: string) {
    await SecureStore.setItemAsync(this.refreshTokenKey, refreshToken)
  }

  private static async deleteAccessToken() {
    return SecureStore.deleteItemAsync(this.accessTokenKey)
  }
}
