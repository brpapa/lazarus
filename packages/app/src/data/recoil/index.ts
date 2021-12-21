import { atom } from 'recoil'
export { userCoordinateState } from './user-coordinate'
export { userJwtTokenState } from './user-jwt-token'

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
