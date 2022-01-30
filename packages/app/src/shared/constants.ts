import { isDevice } from 'expo-device'
import { Dimensions, Platform } from 'react-native'
import type { EdgeInsets } from 'react-native-safe-area-context'

export const __DEVICE_IS_SIMULATOR__ = !isDevice
export const __IOS__ = Platform.OS === 'ios'
export const __ANDROID__ = Platform.OS === 'android'

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export const NOTIFICATIONS_PAGE_SIZE = 10
export const VIDEO_RECORD_MAX_DURATION_S = 30

export const CONTENT_SPACING = 15

const SAFE_BOTTOM = (insets: EdgeInsets) =>
  Platform.select({
    ios: insets.bottom,
  }) ?? 0

export const SAFE_AREA_PADDING = {
  paddingLeft: (insets: EdgeInsets) => insets.left + CONTENT_SPACING,
  paddingTop: (insets: EdgeInsets) => insets.top + CONTENT_SPACING,
  paddingRight: (insets: EdgeInsets) => insets.right + CONTENT_SPACING,
  paddingBottom: (insets: EdgeInsets) => SAFE_BOTTOM(insets) + CONTENT_SPACING,
}

// The maximum zoom _factor_ you should be able to zoom in
export const MAX_ZOOM_FACTOR = 20

export const SCREEN_WIDTH = Dimensions.get('window').width
export const SCREEN_HEIGHT = (insets: EdgeInsets) =>
  Platform.select<number>({
    android: Dimensions.get('screen').height - insets.bottom,
    ios: Dimensions.get('window').height,
  }) as number

// Capture Button
export const CAPTURE_BUTTON_SIZE = 78
