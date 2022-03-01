import { APP_ENV, SERVER_HTTP_BASE_URL } from '@env'
import type { LocationTaskOptions } from 'expo-location'
import * as Location from 'expo-location'
import { __ANDROID__, __IOS__ } from '~/shared/constants'
import type { ColorScheme } from './theme/v1/helpers/color-scheme'

console.log(`[info] ${JSON.stringify({ APP_ENV, SERVER_HTTP_BASE_URL })}`)

export const ENABLE_GOOGLE_MAPS = __IOS__ || __ANDROID__
export const ENABLE_CAMERA_MOCK = false
export const ENABLE_NAVIGATION_STATE_PERSISTENCE = false

export const FOREGROUND_LOCATION_OPTIONS: Location.LocationOptions = {
  accuracy: Location.Accuracy.Balanced,
  timeInterval: 100,
  distanceInterval: 50,
  mayShowUserSettingsDialog: false,
}

export const BACKGROUND_LOCATION_OPTIONS: LocationTaskOptions = {
  accuracy: Location.Accuracy.Balanced,
  timeInterval: 10000,
  distanceInterval: 100,
  mayShowUserSettingsDialog: false,
  pausesUpdatesAutomatically: true,
}

export const FIXED_COLOR_SCHEME: ColorScheme = 'light' // se for no-preference é considerado preferencia sistema
