import { isDevice } from 'expo-device'
import { Dimensions, Platform } from 'react-native'

export const __DEVICE_IS_SIMULATOR__ = !isDevice
export const __IOS__ = Platform.OS === 'ios'
export const __ANDROID__ = Platform.OS === 'android'

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export const NOTIFICATIONS_PAGE_SIZE = 10
