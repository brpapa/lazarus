import * as React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import type { StackNavigationProp, StackScreenProps } from '@react-navigation/stack'

import ExplorerScreen from '~/screens/Explorer'
import { ReportStackScreen } from '~/screens/ReportScreen'
import NotificationsScreen from '~/screens/Notifications'
import ProfileScreen from '~/screens/Profile'
import type { RootStackParams } from '~/RootNavigator'
import intl from '~/shared/intl'
import { UserIcon, CameraIcon, BellIcon, MapIcon, ActivityIcon } from '~/assets/icons'
import { getFocusedRouteNameFromRoute, RouteProp, useNavigation } from '@react-navigation/core'
import { useQueryLoader } from 'react-relay'
import { IncidentsWithinBoundaryQuery, IncidentsWithinBoundaryQueryType } from '~/data/relay'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { initialRegionState } from '~/data/recoil'

export type HomeBottomTabParams = {
  Explorer: undefined
  Feed: undefined
  Report: undefined
  Notifications: undefined
  Profile: undefined
}
const HomeBottomTab = createBottomTabNavigator<HomeBottomTabParams>()

export function HomeScreen() {
  const rootStackNavigation = useNavigation<StackNavigationProp<RootStackParams, 'Home'>>()
  
  return (
    <HomeBottomTab.Navigator initialRouteName="Explorer">
      <HomeBottomTab.Screen
        name="Explorer"
        component={ExplorerScreen}
        options={{
          tabBarLabel: intl.explorer,
          tabBarIcon: (props) => <MapIcon color={props.color} />,
        }}
      />
      <HomeBottomTab.Screen
        name="Feed"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: (props) => <ActivityIcon color={props.color} />,
        }}
      />
      <HomeBottomTab.Screen
        name="Report"
        component={ReportStackScreen}
        options={({ route }) => ({
          tabBarLabel: intl.report,
          tabBarIcon: (props) => <CameraIcon color={props.color} />,
          tabBarVisible: false,
          // tabBarVisible: getReportTabBarVisibilityFromRoute(route),
        })}
      />
      <HomeBottomTab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarBadge: 2,
          tabBarLabel: intl.notifications,
          tabBarIcon: (props) => <BellIcon color={props.color} />,
        }}
      />
      <HomeBottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: intl.profile,
          tabBarIcon: (props) => <UserIcon color={props.color} />,
        }}
      />
    </HomeBottomTab.Navigator>
  )
}

const getReportTabBarVisibilityFromRoute = (route: RouteProp<HomeBottomTabParams, 'Report'>) => {
  // get the currently active route name from this child navigator
  const routeName = getFocusedRouteNameFromRoute(route)
  return !(routeName === 'Camera')
}