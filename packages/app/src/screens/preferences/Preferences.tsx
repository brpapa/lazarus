import { t } from '@metis/shared'
import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { Divider, Text } from '~/components/v1/atoms'
import { MenuItem } from '~/components/v1/molecules'
import type { HomeTabNavProp } from '~/navigation/types'
import { makeUseStyles, useColorScheme } from '~/theme/v1'

// TODO
const DISTANCE_RADIUS = 51

export function Preferences() {
  const s = useStyles()
  const nav = useNavigation<HomeTabNavProp<'Profile'>>()

  const { colorScheme } = useColorScheme()

  return (
    <View style={s.container}>
      <ScrollView>
        <View style={s.bodyContainer}>
          <View style={s.menuContainer}>
            <MenuItem
              title={t('colorScheme')}
              iconName="Dark"
              showRightIcon={false}
              rightText={colorScheme}
              onPress={() => nav.navigate('ColorSchemePreference')}
            />
            <Divider />
            <MenuItem
              title={t('Distance radius')}
              iconName="Notifications" // TODO
              showRightIcon={false}
              rightText={t('formatters.distance', { distInMeters: DISTANCE_RADIUS }) as string}
              onPress={() =>
                nav.navigate('DistanceRadiusPreference', { currentValue: DISTANCE_RADIUS })
              }
            />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const useStyles = makeUseStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bodyContainer: {
    backgroundColor: colors.backgroundDarker,
  },
  menuContainer: {
    backgroundColor: colors.background,
    marginTop: spacing.m,
  },
}))
