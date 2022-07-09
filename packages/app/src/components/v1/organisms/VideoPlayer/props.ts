import type { SliderProps } from '@react-native-community/slider'
import type { AVPlaybackStatus, Video, VideoProps } from 'expo-av'
import type { MutableRefObject, ReactNode } from 'react'
import * as reactNative from 'react-native'
import type { ErrorType } from './constants'

// https://github.com/typescript-cheatsheets/react/issues/415
export type VideoPlayerProps = RequiredProps & DefaultProps

export const defaultProps = {
  errorCallback: (error) =>
    console.error(`[VideoPlayer] ${error.type} Error - ${error.message}: ${error.obj}`),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  playbackCallback: () => {},
  defaultControlsVisible: false,
  timeVisible: true,
  slider: {
    visible: true,
  },
  textStyle: {
    color: '#FFF',
    fontSize: 12,
    textAlign: 'center',
  },
  activityIndicator: {
    size: 'large',
    color: '#999',
  },
  animation: {
    fadeInDuration: 300,
    fadeOutDuration: 300,
  },
  style: {
    width: reactNative.Platform.OS === 'web' ? '100%' : reactNative.Dimensions.get('window').width,
    height: reactNative.Dimensions.get('window').height,
    videoBackgroundColor: '#000',
    controlsBackgroundColor: '#000',
  },
  autoHidePlayer: true,
  header: undefined,
} as DefaultProps

type RequiredProps = {
  videoProps: VideoProps & {
    ref?: MutableRefObject<Video>
  }
}

type DefaultProps = {
  errorCallback: (error: ErrorType) => void
  playbackCallback: (status: AVPlaybackStatus) => void
  defaultControlsVisible: boolean
  timeVisible: boolean
  textStyle: reactNative.TextStyle
  slider: {
    visible?: boolean
  } & SliderProps
  activityIndicator: reactNative.ActivityIndicatorProps
  animation: {
    fadeInDuration?: number
    fadeOutDuration?: number
  }
  header: ReactNode
  style: {
    width?: number
    height?: number
    videoBackgroundColor?: reactNative.ColorValue
    controlsBackgroundColor?: reactNative.ColorValue
  }
  autoHidePlayer: boolean
}
