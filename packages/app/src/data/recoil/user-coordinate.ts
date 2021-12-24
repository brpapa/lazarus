import * as Location from 'expo-location'
import { atom } from 'recoil'

const getCurrentUserCoordinate = async () => {
  const { coords } = await Location.getCurrentPositionAsync()
  console.log(`Initial user location: (${coords.latitude}, ${coords.longitude})`)

  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
  }
}

export const userCoordinateState = atom<Coordinate>({
  key: 'userCoordinate',
  default: { latitude: 0, longitude: 0 },
  effects_UNSTABLE: [
    ({ setSelf }) => {
      // suspends all components under RecoilRoot while this promise is not resolved
      setSelf(getCurrentUserCoordinate())

      // subscribe for location updates when app is in foreground
      const subscription = Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 100,
          distanceInterval: 10,
          mayShowUserSettingsDialog: false,
        },
        ({ coords }) => {
          console.log(`[recoil] New location: (${coords.latitude}, ${coords.longitude})`)
          setSelf({
            latitude: coords.latitude,
            longitude: coords.longitude,
          })
        },
      )

      // cleanup subscription
      return () => subscription.then((s) => s.remove())
    },
  ],
})
