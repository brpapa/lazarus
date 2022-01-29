import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import type { CompositeNavigationProp, RouteProp } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'

// AppStackNavigator -> RootStackNavigator -> MainStackNavigator -> HomeTabNavigator -> ReportStackNavigator

export type AppStackParams = {
  RequiredPermissions: undefined
  RootStackNavigator: undefined
}
export type RootStackParams = {
  Main: undefined
  ReportIncident: {
    capturedMedias: CapturedMedia[]
  }
  IncidentComments: {
    incidentId: string
  }
  ColorSchemePreference: undefined
  DistanceRadiusPreference: {
    currentValue: number
  }
}
export type MainStackParams = {
  HomeTabNavigator: undefined
  IncidentDetail: {
    incidentId: string
  }
  Notifications: undefined
  Preferences: undefined
  SignIn: undefined
  SignUp: undefined
}
export type HomeTabParams = {
  Explorer: undefined
  ReportStackNavigator: undefined
  Profile: undefined
}
export type ReportStackParams = {
  CameraPermissions: undefined
  Camera?: {
    previousCapturedMedias?: CapturedMedia[]
  }
  MediasReview: {
    capturedMedias: CapturedMedia[]
  }
}

export type RootStackNavProp<T extends keyof RootStackParams> = StackNavigationProp<
  RootStackParams,
  T
>
export type MainStackNavProp<T extends keyof MainStackParams> = CompositeNavigationProp<
  StackNavigationProp<MainStackParams, T>,
  StackNavigationProp<RootStackParams>
>
export type HomeTabNavProp<T extends keyof HomeTabParams> = CompositeNavigationProp<
  BottomTabNavigationProp<HomeTabParams, T>,
  CompositeNavigationProp<
    StackNavigationProp<MainStackParams>,
    StackNavigationProp<RootStackParams>
  >
>
export type ReportStackNavProp<T extends keyof ReportStackParams> = CompositeNavigationProp<
  StackNavigationProp<ReportStackParams, T>,
  CompositeNavigationProp<
    BottomTabNavigationProp<HomeTabParams>,
    CompositeNavigationProp<
      StackNavigationProp<MainStackParams>,
      StackNavigationProp<RootStackParams>
    >
  >
>

export type RootStackRouteProp<T extends keyof RootStackParams> = RouteProp<RootStackParams, T>
export type MainStackRouteProp<T extends keyof MainStackParams> = RouteProp<MainStackParams, T>
export type HomeTabRouteProp<T extends keyof HomeTabParams> = RouteProp<HomeTabParams, T>
export type ReportStackRouteProp<T extends keyof ReportStackParams> = RouteProp<
  ReportStackParams,
  T
>
