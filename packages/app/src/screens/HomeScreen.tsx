import { t } from '@metis/shared'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { getFocusedRouteNameFromRoute, RouteProp } from '@react-navigation/core'
import React from 'react'
import { graphql, PreloadedQuery, usePreloadedQuery } from 'react-relay'
import { ActivityIcon, BellIcon, CameraIcon, MapIcon, UserIcon } from '~/assets/icons'
import { ExplorerScreen } from '~/screens/ExplorerScreen'
import { NotificationsScreen } from '~/screens/NotificationsScreen'
import { ProfileScreen } from '~/screens/ProfileScreen'
import { ReportStackScreen } from '~/screens/ReportScreen'
import type { HomeScreenQuery as HomeScreenQueryType } from '~/__generated__/HomeScreenQuery.graphql'

export type HomeBottomTabParams = {
  Explorer: undefined
  Todo: undefined
  Report: undefined
  Notifications: undefined
  Profile: undefined
}
const HomeBottomTab = createBottomTabNavigator<HomeBottomTabParams>()

type HomeScreenProps = {
  preloadedQuery: PreloadedQuery<HomeScreenQueryType>
}

const query = graphql`
  query HomeScreenQuery {
    notificationsInfo: myNotifications {
      notSeenCount
    }
    ...ExplorerScreen_query
    ...NotificationsScreen_query
  }
`

export function HomeScreen(props: HomeScreenProps) {
  const data = usePreloadedQuery<HomeScreenQueryType>(query, props.preloadedQuery)

  return (
    <HomeBottomTab.Navigator initialRouteName="Explorer">
      <HomeBottomTab.Screen
        name="Explorer"
        options={{
          tabBarLabel: t('home.explorerTabLabel'),
          tabBarIcon: (props) => <MapIcon color={props.color} />,
        }}
      >
        {() => <ExplorerScreen query={data} />}
      </HomeBottomTab.Screen>
      <HomeBottomTab.Screen
        name="Todo"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Todo',
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
        options={{
          tabBarBadge: data?.notificationsInfo?.notSeenCount ?? undefined,
          tabBarLabel: t('home.notificationsTabLabel'),
          tabBarIcon: (props) => <BellIcon color={props.color} />,
        }}
      >
        {() => <NotificationsScreen query={data} />}
      </HomeBottomTab.Screen>
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
