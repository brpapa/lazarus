import type { BottomTabBarOptions, BottomTabBarProps } from '@react-navigation/bottom-tabs'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Badge, Icon, Text } from '~/components/v1/atoms'
import { __IOS__ } from '~/config'
import type { IconName } from '~/icons'
import { makeUseStyles, useTheme } from '~/theme/v1'
import type { HomeTabParams } from '../types'

const routeToIcon = (route: keyof HomeTabParams): IconName => {
  switch (route) {
    case 'Explorer':
      return 'Home'
    case 'ReportStackNavigator':
      return 'Camera'
    case 'Profile':
      return 'Person'
    default:
      throw new Error(`Unexpected route, received: ${route}`)
  }
}

export function TabBar({ state, navigation, descriptors }: BottomTabBarProps<BottomTabBarOptions>) {
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
    right: -13,
    top: -7,
  },
}))
