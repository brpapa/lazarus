import type { LocationObject } from 'expo-location'
import * as Location from 'expo-location'
import type { TaskManagerTaskBody } from 'expo-task-manager'
import * as TaskManager from 'expo-task-manager'
import { BACKGROUND_LOCATION_OPTIONS } from '~/config'
import { commitUpdateUserLocationMutation } from '../relay/mutations/UpdateUserLocationMutation'

export const TASK_NAME = 'background-location-tracking-task'

/**
  `defineTask` must be called in the global scope of js bundle, it cannot be called in any of React lifecycle methods because the application is launched in the background, then the js app is spined up, then the task is runned and then the application is shutted down. So no views are mounted.
 */
TaskManager.defineTask(TASK_NAME, async (body: any) => {
  const { data, error }: TaskManagerTaskBody<{ locations: LocationObject[] }> = body

  if (error) {
    console.error(error)
    return
  }

  if (data) {
    const { coords } = data.locations[data.locations.length - 1]

    const result = await commitUpdateUserLocationMutation({
      location: {
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
    })
    result.mapErr(console.error)

    console.log(
      `[task] Server updated with the new user location: (${coords.latitude}, ${coords.longitude})`,
    )
  }
})

/** register for location updates when app is in background or foreground, if the user has granted permission */
export const startBackgroundLocationTracking = async () => {
  try {
    const status = await Location.getBackgroundPermissionsAsync()
    if (!status.granted) return

    await Location.startLocationUpdatesAsync(TASK_NAME, BACKGROUND_LOCATION_OPTIONS)

    const started = await Location.hasStartedLocationUpdatesAsync(TASK_NAME)
    if (started) console.log(`Background location tracking started`)
  } catch (e) {
    console.error('Error to start background location tracking', e)
  }
}
