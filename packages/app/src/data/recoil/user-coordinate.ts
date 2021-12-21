import * as Location from 'expo-location'
import { atom, DefaultValue } from 'recoil'

const getCurrentUserCoordinate = async () => {
  const response = await Location.requestForegroundPermissionsAsync()
  if (response.status !== Location.PermissionStatus.GRANTED) {
    console.error('Permission to access location was denied by user')
    return new DefaultValue()
  }
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
          accuracy: Location.Accuracy.High,
        },
        ({ coords }) => {
          console.log(`New user location: (${coords.latitude}, ${coords.longitude})`)
          // TODO: send to server
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
