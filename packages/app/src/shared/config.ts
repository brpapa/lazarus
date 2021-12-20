import { isDevice } from 'expo-device'
import { Dimensions, Platform } from 'react-native'

export const __DEVICE_IS_SIMULATOR__ = !isDevice

export const THEME_NAME: ThemeName = 'default'
export const LANG: Language = 'pt-br'

export const SERVER_BASE_URL = 'http://192.168.0.25:5555' // `ifconfig | grep inet`

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

export const ENABLE_GOOGLE_MAPS = ['ios', 'android'].includes(Platform.OS)

/** if true  the Camera component will be mocked */
export const ENABLE_CAMERA_MOCK = true

/** if true, every time that app is reloaded, the user will going to be in last screen visited */
export const ENABLE_NAVIGATION_STATE_PERSISTENCE = false