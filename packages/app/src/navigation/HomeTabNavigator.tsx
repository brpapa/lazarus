import { t } from '@metis/shared'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { getFocusedRouteNameFromRoute, RouteProp } from '@react-navigation/core'
import React from 'react'
import { graphql, PreloadedQuery, usePreloadedQuery } from 'react-relay'
import { ActivityIcon, BellIcon, CameraIcon, MapIcon, UserIcon } from '~/icons_LEGACY'
import { Explorer, Notifications, Profile } from '~/screens'
import type { HomeTabNavigatorQuery as HomeTabNavigatorQueryType } from '~/__generated__/HomeTabNavigatorQuery.graphql'
import { ReportStackNavigator } from './ReportStackNavigator'

export type HomeBottomTabParams = {
  Explorer: undefined
  Todo: undefined
  ReportStackNavigator: undefined
  Notifications: undefined
  Profile: undefined
}
const HomeBottomTab = createBottomTabNavigator<HomeBottomTabParams>()

type HomeProps = {
  preloadedQuery: PreloadedQuery<HomeTabNavigatorQueryType>
}

const query = graphql`
  query HomeTabNavigatorQuery {
    notificationsInfo: myNotifications {
      notSeenCount
    }
    ...Explorer_query
    ...Notifications_query
  }
`

export function HomeTabNavigator(props: HomeProps) {
  const data = usePreloadedQuery<HomeTabNavigatorQueryType>(query, props.preloadedQuery)

  return (
    <HomeBottomTab.Navigator initialRouteName="Explorer">
      <HomeBottomTab.Screen
        name="Explorer"
        options={{
          tabBarLabel: t('home.explorerTabLabel'),
          tabBarIcon: (props) => <MapIcon color={props.color} />,
        }}
      >
        {() => <Explorer queryRef={data} />}
      </HomeBottomTab.Screen>
      <HomeBottomTab.Screen
        name="Todo"
        options={{
          tabBarLabel: 'Todo',
          tabBarIcon: (props) => <ActivityIcon color={props.color} />,
        }}
      >
        {() => <Profile />}
      </HomeBottomTab.Screen>
      <HomeBottomTab.Screen
        name="ReportStackNavigator"
        options={({ route }) => ({
          tabBarLabel: t('home.reportTabLabel'),
          tabBarIcon: (props) => <CameraIcon color={props.color} />,
          tabBarVisible: false,
          // tabBarVisible: getReportTabBarVisibilityFromRoute(route),
        })}
      >
        {() => <ReportStackNavigator />}
      </HomeBottomTab.Screen>
      <HomeBottomTab.Screen
        name="Notifications"
        options={{
          tabBarBadge: getBadge(data?.notificationsInfo?.notSeenCount),
          tabBarLabel: t('home.notificationsTabLabel'),
          tabBarIcon: (props) => <BellIcon color={props.color} />,
        }}
      >
        {() => <Notifications queryRef={data} />}
      </HomeBottomTab.Screen>
      <HomeBottomTab.Screen
        name="Profile"
        options={{
          tabBarLabel: t('home.profileTabLabel'),
          tabBarIcon: (props) => <UserIcon color={props.color} />,
        }}
      >
        {() => <Profile />}
      </HomeBottomTab.Screen>
    </HomeBottomTab.Navigator>
  )
}

const getBadge = (count?: number) => (count && count > 0 ? count : undefined)

const getReportTabBarVisibilityFromRoute = (route: RouteProp<HomeBottomTabParams, 'ReportStackNavigator'>) => {
  // get the currently active route name from this child navigator
  const routeName = getFocusedRouteNameFromRoute(route)
  return !(routeName === 'Camera')
}
