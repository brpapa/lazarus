import * as Location from 'expo-location'
import { atom } from 'recoil'
import { FOREGROUND_LOCATION_OPTIONS } from '~/config'
import { AuthTokensManager } from '../auth-tokens-manager'
import { commitUpdateUserLocationMutation } from '../relay/mutations/UpdateUserLocationMutation'

const getInitialUserLocation = async () => {
  const status = await Location.getForegroundPermissionsAsync()
  if (!status.granted)
    throw new Error(
      'The initial permissions screen must make the foreground permission required to use app',
    )

  const { coords } = await Location.getCurrentPositionAsync(FOREGROUND_LOCATION_OPTIONS)
  const location = {
    latitude: coords.latitude,
    longitude: coords.longitude,
  }
  console.log(`[recoil] Initial user location: (${location.latitude}, ${location.longitude})`)

  if (await AuthTokensManager.isSignedIn()) {
    // update server with the first initial location value when app is foregound because the user can not have granted background location permission
    commitUpdateUserLocationMutation(location)
  }

  return location
}

export const userLocationState = atom<Location>({
  key: 'userLocation',
  default: { latitude: 0, longitude: 0 },
  effects_UNSTABLE: [
    ({ setSelf }) => {
      const promise = getInitialUserLocation()
      setSelf(promise) // suspends all components under RecoilRoot while this promise is not resolved or another setSelf is called before

      // subscribe for location updates when app is in foreground
      const subscription = Location.watchPositionAsync(
        FOREGROUND_LOCATION_OPTIONS,
        ({ coords }) => {
          setSelf({
            latitude: coords.latitude,
            longitude: coords.longitude,
          })
          console.log(`[recoil] Updated user location: (${coords.latitude}, ${coords.longitude})`)
        },
      )

      // cleanup subscription
      return () => subscription.then((s) => s.remove())
    },
  ],
})
