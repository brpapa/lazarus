import { t } from '@metis/shared'
import {
  BottomTabBarOptions,
  BottomTabBarProps,
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { graphql, usePreloadedQuery } from 'react-relay'
import { useRecoilValue } from 'recoil'
import { Badge, Icon, Text } from '~/components/v1/atoms'
import { __IOS__ } from '~/config'
import { initialQueryRefState } from '~/data/recoil/initial-query-ref'
import { useOnNearbyIncidentCreatedSubscription } from '~/data/relay/subscriptions/OnNearbyIncidentCreatedSubscription'
import { usePushNotificationsListener } from '~/hooks/use-push-notifications-listener'
import { useSession } from '~/hooks/use-session'
import type { IconName } from '~/icons'
import { Explorer, Notifications, Profile } from '~/screens'
import { makeUseStyles, useTheme } from '~/theme/v1'
import type { HomeTabNavigatorQuery as HomeTabNavigatorQueryType } from '~/__generated__/HomeTabNavigatorQuery.graphql'
import { ReportStackNavigator } from './ReportStackNavigator'

export type HomeTabParams = {
  Explorer: undefined
  ReportStackNavigator: undefined
  Notifications: undefined
  Profile: undefined
}

const HomeTab = createBottomTabNavigator<HomeTabParams>()

const query = graphql`
  query HomeTabNavigatorQuery {
    notificationsInfo: myNotifications {
      notSeenCount
    }
    ...Explorer_query
    ...Notifications_query
  }
`

export function HomeTabNavigator() {
  const homeTabNavitorQueryRef = useRecoilValue(initialQueryRefState)
  const data = usePreloadedQuery<HomeTabNavigatorQueryType>(query, homeTabNavitorQueryRef)

  const { isSignedIn } = useSession()
  useOnNearbyIncidentCreatedSubscription({ when: isSignedIn })
  usePushNotificationsListener({ when: isSignedIn })

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
        name="Notifications"
        options={{
          tabBarBadge: getBadge(data?.notificationsInfo?.notSeenCount),
          title: t('home.notificationsTabLabel'),
        }}
      >
        {(props) => <Notifications queryRef={data} {...props} />}
      </HomeTab.Screen>
      <HomeTab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: t('home.profileTabLabel'),
        }}
      />
    </HomeTab.Navigator>
  )
}

const getBadge = (count?: number) => (count && count > 0 ? count : undefined)

function TabBar({ state, navigation, descriptors }: BottomTabBarProps<BottomTabBarOptions>) {
  const insets = useSafeAreaInsets()
  const s = useStyles()
  const { colors } = useTheme()

  const focusedRoute = state.routes[state.index]
  const tabBarNotVisible = descriptors[focusedRoute.key]?.options.tabBarVisible === false
  if (tabBarNotVisible) return null

  return (
    <View style={s.tabContainer}>
      {state.routes.map((route, index) => {
        // for each tab

        const { options } = descriptors[route.key]
        const label = options.title !== undefined ? options.title : route.name
        const badge = options.tabBarBadge

        const onPress = async () => {
          if (state.index === 0 && state.index === index) {
            navigation.navigate(route.name, { backToTop: true })
          } else {
            navigation.navigate(route.name, { backToTop: false })
          }
        }

        return (
          <TouchableOpacity
            key={state.routes[index].key}
            onPress={onPress}
            style={s.tab}
            activeOpacity={state.index === index ? 1 : 0.2}
          >
            <View style={[{ paddingBottom: insets.bottom }, s.tabItemContainer]}>
              <Icon
                name={routeToIcon(route.name as keyof HomeTabParams)}
                size="xl"
                color={state.index === index ? colors.activeTab : colors.inactiveTab}
              />
              <Badge visible={badge != null} style={s.badge} size={(25 * 3) / 4}>
                {badge}
              </Badge>
              <Text color={state.index === index ? 'activeTab' : 'inactiveTab'} size="xs">
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const routeToIcon = (route: keyof HomeTabParams): IconName => {
  switch (route) {
    case 'Explorer':
      return 'Map'
    case 'ReportStackNavigator':
      return 'Camera'
    case 'Notifications':
      return 'Bell'
    case 'Profile':
      return 'User'
    default:
      throw new Error(`Unexpected route, received: ${route}`)
  }
}

const useStyles = makeUseStyles(({ colors }) => ({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderWidth: 0.2,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: __IOS__ ? 15 : '3%',
  },
  tabItemContainer: {
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    right: 15,
    top: -7,
  },
}))
