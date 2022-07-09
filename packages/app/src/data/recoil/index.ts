import { atom } from 'recoil'

export { userLocationState } from './user-location'
export { accessTokenState } from './access-token'

export const selectedIncidentIdInMap = atom<string | null>({
  key: 'selectedIncidentIdInMap',
  default: null,
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((newValue) => {
        console.log(`selectedIncidentIdInMap changed to: ${newValue}`)
      })
    },
  ],
})
