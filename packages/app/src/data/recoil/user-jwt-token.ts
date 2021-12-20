import { atom, DefaultValue } from 'recoil'
import * as SecureStore from 'expo-secure-store'

const PERSISTENCE_KEY = 'USER_JWT_TOKEN'

export const userJwtToken = atom<string | null>({
  key: 'userJwtToken',
  default: null,
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      // suspends all components under RecoilRoot while the promise is not resolved
      setSelf(
        SecureStore.getItemAsync(PERSISTENCE_KEY)
          .then((token) => (token != null ? token : new DefaultValue()))
          .catch((err) => {
            console.error('Loading token failed', err)
            return new DefaultValue()
          }),
      )

      // sync state changes with secure store
      onSet((newValue) => {
        if (newValue !== null) SecureStore.setItemAsync(PERSISTENCE_KEY, newValue)
        else SecureStore.deleteItemAsync(PERSISTENCE_KEY)
      })
    },
  ],
})
