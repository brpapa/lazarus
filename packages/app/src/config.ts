import type { LocationTaskOptions } from 'expo-location'
import * as Location from 'expo-location'
import { __IOS__, __ANDROID__ } from '~/shared/constants'
import type { ColorScheme } from './theme/v1/helpers/color-scheme'

const SERVER_HOST = '192.168.0.25' // `ifconfig | grep inet`
const SERVER_PORT = 5555
export const HTTP_SERVER_BASE_URL = `http://${SERVER_HOST}:${SERVER_PORT}`
export const WS_SERVER_BASE_URL = `ws://${SERVER_HOST}:${SERVER_PORT}`

export const ENABLE_GOOGLE_MAPS = __IOS__ || __ANDROID__
export const ENABLE_CAMERA_MOCK = false
export const ENABLE_NAVIGATION_STATE_PERSISTENCE = true

export const FOREGROUND_LOCATION_OPTIONS: Location.LocationOptions = {
  accuracy: Location.Accuracy.High,
  timeInterval: 100,
  distanceInterval: 10,
  mayShowUserSettingsDialog: false,
}

export const BACKGROUND_LOCATION_OPTIONS: LocationTaskOptions = {
  accuracy: Location.Accuracy.Balanced,
  timeInterval: 10_000,
  distanceInterval: 100,
  mayShowUserSettingsDialog: false,
  pausesUpdatesAutomatically: true,
}

export const FIXED_COLOR_SCHEME: ColorScheme = 'light' // se no-preference é considerado preferencia sistema

export type ThemeName_V2_BETA_TAMAGUI = 'light' | 'dark'
export const DEFAULT_THEME_V2_BETA_TAMAGUI: ThemeName_V2_BETA_TAMAGUI = 'light'
