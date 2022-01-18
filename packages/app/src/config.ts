import { isDevice } from 'expo-device'
import type { LocationTaskOptions } from 'expo-location'
import * as Location from 'expo-location'
import { Dimensions, Platform } from 'react-native'

export const __DEVICE_IS_SIMULATOR__ = !isDevice
export const __IOS__ = Platform.OS === 'ios'
export const __ANDROID__ = Platform.OS === 'android'

const SERVER_HOST = '192.168.0.25' // `ifconfig | grep inet`
const SERVER_PORT = 5555
export const HTTP_SERVER_BASE_URL = `http://${SERVER_HOST}:${SERVER_PORT}`
export const WS_SERVER_BASE_URL = `ws://${SERVER_HOST}:${SERVER_PORT}`

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

export const ENABLE_GOOGLE_MAPS = ['ios', 'android'].includes(Platform.OS)

/** if true the Camera component will be mocked */
export const ENABLE_CAMERA_MOCK = true

/** if true, every time that app is reloaded, the user will going to be in last screen visited */
export const ENABLE_NAVIGATION_STATE_PERSISTENCE = false

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

export type ThemeName_V0_LEGACY = 'default' | 'dark'
export const DEFAULT_THEME_V0_LEGACY: ThemeName_V0_LEGACY = 'default'
export type ThemeName_V2_BETA_TAMAGUI = 'light' | 'dark'
export const DEFAULT_THEME_V2_BETA_TAMAGUI: ThemeName_V2_BETA_TAMAGUI = 'light'
