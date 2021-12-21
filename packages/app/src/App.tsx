import React, { Suspense } from 'react'
import { StatusBar, StatusBarStyle } from 'react-native'
import { ThemeProvider } from '@shopify/restyle'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { RecoilRoot } from 'recoil'
import { RelayEnvironmentProvider } from 'react-relay'

import { theme, darkTheme } from '~/shared/theme'
import { THEME_NAME } from '~/shared/config'
import RootNavigator from '~/RootNavigator'
import { environment } from '~/data/relay/environment'
import Loading from './components/Loading'

export default function App() {
  return (
    <RelayEnvironmentProvider environment={environment}>
      <ThemeProvider theme={THEME_NAME == 'default' ? theme : darkTheme}>
        <RecoilRoot>
          {/* show a fallback while waiting for recoil load async values (those where setSelf receives a Promise) */}
          <Suspense fallback={<Loading />}>
            <SafeAreaProvider>
              <StatusBar barStyle={statusBarStyle[THEME_NAME]} />
              <RootNavigator />
            </SafeAreaProvider>
          </Suspense>
        </RecoilRoot>
      </ThemeProvider>
    </RelayEnvironmentProvider>
  )
}

const statusBarStyle: Record<ThemeName, StatusBarStyle> = {
  default: 'dark-content',
  dark: 'light-content',
}
