declare module '*.jpg'
declare module '*.png'

declare module '*.svg' {
  import React from 'react'
  import { SvgProps } from 'react-native-svg'
  const Component: React.FC<SvgProps>
  export default Component
}

declare module '@env' {
  export const APP_ENV: 'local' | 'prod'
  export const SERVER_HTTP_BASE_URL: string
  export const SERVER_WS_BASE_URL: string
  export const GOOGLE_MAPS_IOS_SDK_API_KEY: string
  export const GOOGLE_MAPS_ANDROID_SDK_API_KEY: string
}
