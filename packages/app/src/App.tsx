// import { DEFAULT_THEME_V2_BETA_TAMAGUI } from '~/config'
// import Tamagui from '../tamagui.config'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ColorSchemeProvider, ThemeProvider } from '~/theme/v1'
import { AppStackNavigator } from './navigation/AppStackNavigator'

export function App() {
  return (
    <SafeAreaProvider>
      <ColorSchemeProvider>
        <ThemeProvider>
          <AppStackNavigator />
        </ThemeProvider>
      </ColorSchemeProvider>
    </SafeAreaProvider>
  )
}
