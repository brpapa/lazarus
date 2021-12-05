import React from 'react'
import { StatusBar, StatusBarStyle } from 'react-native'
import { ThemeProvider } from '@shopify/restyle'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { RecoilRoot } from 'recoil'
import { RelayEnvironmentProvider } from 'react-relay'

import { theme, darkTheme } from '~/shared/theme'
import { THEME_NAME } from '~/shared/config'
import RootNavigator from '~/RootNavigator'
import { environment } from '~/relay-environment'

export default function App() {
  return (
    <RelayEnvironmentProvider environment={environment}>
      <RecoilRoot>
        <ThemeProvider theme={THEME_NAME == 'default' ? theme : darkTheme}>
          <SafeAreaProvider>
            <StatusBar barStyle={statusBarStyle[THEME_NAME]} />
            <RootNavigator />
          </SafeAreaProvider>
        </ThemeProvider>
      </RecoilRoot>
    </RelayEnvironmentProvider>
  )
}

const statusBarStyle: Record<ThemeName, StatusBarStyle> = {
  default: 'dark-content',
  dark: 'light-content',
}
