import { SecureStoreProxy } from '~/data/secure-store-proxy'
import { atom, DefaultValue } from 'recoil'

export const accessTokenState = atom<AccessToken | null>({
  key: 'accessToken',
  default: null,
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      // suspends all components under RecoilRoot while the promise is not resolved
      setSelf(
        SecureStoreProxy.getAccessToken()
          .then((token) => (token != null ? token : new DefaultValue()))
          .catch((e) => {
            console.error('Loading token failed', e)
            return new DefaultValue()
          }),
      )

      // update secure store if recoil state changes
      onSet((newAccessToken) => {
        SecureStoreProxy.setAccessToken(newAccessToken)
      })
    },
  ],
})
