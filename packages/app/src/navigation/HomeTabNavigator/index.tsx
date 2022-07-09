import { t } from '@lazarus/shared'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React, { Suspense } from 'react'
import { graphql, useLazyLoadQuery } from 'react-relay'
import { Explorer, Profile } from '~/screens'
import type { HomeTabNavigatorQuery as HomeTabNavigatorQueryType } from '~/__generated__/HomeTabNavigatorQuery.graphql'
import { ReportStackNavigator } from '../ReportStackNavigator'
import type { HomeTabParams } from '../types'
import { TabBar } from './TabBar'

const HomeTab = createBottomTabNavigator<HomeTabParams>()

const query = graphql`
  query HomeTabNavigatorQuery {
    me {
      notifications {
        notSeenCount
      }
    }
    ...Explorer_query
    ...Profile_query
  }
`

export function HomeTabNavigator() {
  const data = useLazyLoadQuery<HomeTabNavigatorQueryType>(query, {})

  return (
    <HomeTab.Navigator initialRouteName="Explorer" tabBar={(props) => <TabBar {...props} />}>
      <HomeTab.Screen
        name="Explorer"
        options={{
          title: t('home.explorerTabLabel'),
        }}
      >
        {(props) => <Explorer queryRef={data} {...props} />}
      </HomeTab.Screen>
      <HomeTab.Screen
        name="ReportStackNavigator"
        component={ReportStackNavigator}
        options={{
          title: t('home.reportTabLabel'),
          tabBarVisible: false,
        }}
      />
      <HomeTab.Screen
        name="Profile"
        options={{
          title: t('home.profileTabLabel'),
          tabBarBadge: getBadge(data.me?.notifications.notSeenCount),
        }}
      >
        {(props) => <Profile queryRef={data} {...props} />}
      </HomeTab.Screen>
    </HomeTab.Navigator>
  )
}

const getBadge = (count?: number) => (count && count > 0 ? count : undefined)
