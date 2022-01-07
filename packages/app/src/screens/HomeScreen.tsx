import { t } from '@metis/shared'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { getFocusedRouteNameFromRoute, RouteProp } from '@react-navigation/core'
import React from 'react'
import { ActivityIcon, BellIcon, CameraIcon, MapIcon, UserIcon } from '~/assets/icons'
import ExplorerScreen from '~/screens/ExplorerScreen'
import NotificationsScreen from '~/screens/NotificationsScreen'
import ProfileScreen from '~/screens/ProfileScreen'
import { ReportStackScreen } from '~/screens/ReportScreen'

export type HomeBottomTabParams = {
  Explorer: undefined
  Feed: undefined
  Report: undefined
  Notifications: undefined
  Profile: undefined
}
const HomeBottomTab = createBottomTabNavigator<HomeBottomTabParams>()

export function HomeScreen() {
  return (
    <HomeBottomTab.Navigator initialRouteName="Explorer">
      <HomeBottomTab.Screen
        name="Explorer"
        component={ExplorerScreen}
        options={{
          tabBarLabel: t('home.explorerTabLabel'),
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
          tabBarLabel: t('home.reportTabLabel'),
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
          tabBarLabel: t('home.notificationsTabLabel'),
          tabBarIcon: (props) => <BellIcon color={props.color} />,
        }}
      />
      <HomeBottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: t('home.profileTabLabel'),
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
