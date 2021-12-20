import { atom, selector } from 'recoil'
export { userJwtToken } from './user-jwt-token'

export const userCoordinateState = atom({
  key: 'userCoordinate',
  default: {
    latitude: -22.8886,
    longitude: -48.4406,
  }, // aka as initial value
})

export const initialRegionState = selector({
  key: 'initialRegionState',
  get: ({ get }) => {
    const userCoordinate = get(userCoordinateState)
    return {
      ...userCoordinate,
      latitudeDelta: 0.1322,
      longitudeDelta: 0.0921,
    }
  },
})

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
