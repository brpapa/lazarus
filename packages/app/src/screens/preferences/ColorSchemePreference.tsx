import { t } from '@lazarus/shared'
import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { HeaderItem, ModalHeader } from '~/components/v1'
import type { RootStackNavProp } from '~/navigation/types'
import { makeUseStyles, useColorScheme } from '~/theme/v1'
import { SettingsItem } from './common/SettingsItem'

export function ColorSchemePreference() {
  const s = useStyles()
  const { colorScheme, setColorScheme } = useColorScheme()
  const nav = useNavigation<RootStackNavProp<'ColorSchemePreference'>>()

  return (
    <View style={s.container}>
      <ModalHeader
        title={t('colorScheme')}
        left={<HeaderItem left label={t('back')} onPressItem={nav.goBack} />}
      />
      <ScrollView>
        <View style={s.bodyContainer}>
          <View style={s.menuContainer}>
            <SettingsItem
              title={t('colorScheme.light')}
              onPress={() => setColorScheme('light')}
              selected={colorScheme === 'light'}
            />
            <SettingsItem
              title={t('colorScheme.dark')}
              onPress={() => setColorScheme('dark')}
              selected={colorScheme === 'dark'}
            />
            <SettingsItem
              title={t('colorScheme.system')}
              onPress={() => setColorScheme('no-preference')}
              selected={colorScheme === 'no-preference'} // TODO: now working yet
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
