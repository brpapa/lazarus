import { JwtToken } from '~/data/jwt-token-loader'
import { atom, DefaultValue } from 'recoil'

export const userJwtTokenState = atom<string | null>({
  key: 'userJwtToken',
  default: null,
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      // suspends all components under RecoilRoot while the promise is not resolved
      setSelf(
        JwtToken.get()
          .then((token) => (token != null ? token : new DefaultValue()))
          .catch((err) => {
            console.error('Loading token failed', err)
            return new DefaultValue()
          }),
      )

      // sync state changes with secure store
      onSet((newValue) => {
        if (newValue !== null) JwtToken.set(newValue)
        else JwtToken.del()
      })
    },
  ],
})
