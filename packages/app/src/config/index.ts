import { isDevice } from 'expo-device'
import { Dimensions, Platform } from 'react-native'

export const __DEVICE_IS_SIMULATOR__ = !isDevice
export const __IOS__ = Platform.OS === 'ios'
export const __ANDROID__ = Platform.OS === 'android'

export const THEME_NAME: ThemeName = 'default'
export const LANG: Language = 'pt-br'

// const SERVER_HOST = '192.168.0.25' // `ifconfig | grep inet`
const SERVER_HOST = '172.20.10.4' // `ifconfig | grep inet`
const SERVER_PORT = 5555
export const HTTP_SERVER_BASE_URL = `http://${SERVER_HOST}:${SERVER_PORT}`
export const WS_SERVER_BASE_URL = `ws://${SERVER_HOST}:${SERVER_PORT}`

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

export const ENABLE_GOOGLE_MAPS = ['ios', 'android'].includes(Platform.OS)

/** if true the Camera component will be mocked */
export const ENABLE_CAMERA_MOCK = true

/** if true, every time that app is reloaded, the user will going to be in last screen visited */
export const ENABLE_NAVIGATION_STATE_PERSISTENCE = false

export { FOREGROUND_LOCATION_OPTIONS } from './location'
export { BACKGROUND_LOCATION_OPTIONS } from './location'
