import { atom } from 'recoil'
import type { Preferences_user$key } from '~/__generated__/Preferences_user.graphql'

export const preferencesUserRefState = atom<Preferences_user$key | null>({
  key: 'preferencesUserRef',
  default: null,
})
