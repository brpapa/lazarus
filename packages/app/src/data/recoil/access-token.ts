import { AuthTokensManager } from '~/data/storage/auth-tokens-manager'
import { atom, DefaultValue } from 'recoil'

export const accessTokenState = atom<AccessToken | null>({
  key: 'accessToken',
  default: null,
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      // suspends all components under RecoilRoot while the promise is not resolved
      setSelf(
        AuthTokensManager.getAccessToken()
          .then((accessToken) => (accessToken != null ? accessToken : new DefaultValue()))
          .catch((e) => {
            console.error('Loading token failed', e)
            return new DefaultValue()
          }),
      )

      // update secure store if recoil state changes
      onSet((newAccessToken) => {
        AuthTokensManager.setAccessToken(newAccessToken)
      })
    },
  ],
})
