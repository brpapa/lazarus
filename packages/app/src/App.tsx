import React from 'react'
import { StatusBar } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { RecoilRoot } from 'recoil'
import { RelayEnvironmentProvider } from 'react-relay'
import RootNavigator from '~/RootNavigator'
import { environment } from '~/relay-environment'
import Tamagui from './../tamagui.config'
import { DEFAULT_THEME } from './shared/config'

export default function App() {
  return (
    <RelayEnvironmentProvider environment={environment}>
      <RecoilRoot>
        <Tamagui.Provider defaultTheme={DEFAULT_THEME}>
          <SafeAreaProvider>
            <StatusBar barStyle={barStyleMap[DEFAULT_THEME]} />
            <RootNavigator />
          </SafeAreaProvider>
        </Tamagui.Provider>
      </RecoilRoot>
    </RelayEnvironmentProvider>
  )
}

const barStyleMap = {
  light: 'dark-content',
  dark: 'light-content',
} as const
