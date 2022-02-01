import { t } from '@metis/shared'
import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { graphql, useFragment } from 'react-relay'
import { Divider } from '~/components/v1'
import { MenuItem } from '~/components/v1'
import type { HomeTabNavProp } from '~/navigation/types'
import { makeUseStyles, useColorScheme } from '~/theme/v1'
import type { Preferences_user$key } from '~/__generated__/Preferences_user.graphql'

const frag = graphql`
  fragment Preferences_user on User {
    preferences {
      radiusDistance
    }
  }
`

type Props = {
  userRef: Preferences_user$key
}

export function Preferences(props: Props) {
  const data = useFragment<Preferences_user$key>(frag, props.userRef)

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
              rightText={
                t('formatters.distance', {
                  distInMeters: data.preferences.radiusDistance,
                }) as string
              }
              onPress={() =>
                nav.navigate('DistanceRadiusPreference', {
                  currentValue: data.preferences.radiusDistance,
                })
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
