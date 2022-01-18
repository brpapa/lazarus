// import { DEFAULT_THEME_V2_BETA_TAMAGUI } from '~/config'
// import Tamagui from '../tamagui.config'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { ThemeProvider_LEGACY } from '~/theme/v0-legacy/theme'
import React, { Suspense } from 'react'
import { StatusBar, StatusBarStyle } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { RelayEnvironmentProvider } from 'react-relay'
import { RecoilRoot } from 'recoil'
import { DEFAULT_THEME_V0_LEGACY, ThemeName_V0_LEGACY } from '~/config'
import { environment } from '~/data/relay/environment'
import { RootStackNavigator } from '~/navigation/RootStackNavigator'
import { darkTheme, theme } from '~/theme/v0-legacy'
import Loading from './components/v0-legacy/Loading'
import { useNavigationStatePersistence } from './hooks/use-navigation-state-persistence'
import { useRequiredPermissions } from './hooks/use-required-permissions'
import { RequiredPermissions } from './screens'
import { AppearanceProvider, ThemeProvider } from '~/theme/v1'

export type AppStackParams = {
  RequiredPermissions: undefined
  App: undefined
}

const AppStack = createStackNavigator<AppStackParams>()

export function App() {
  const requiredPermissions = useRequiredPermissions()
  const navigationState = useNavigationStatePersistence()

  if (navigationState.isLoading || requiredPermissions.isLoading) return <Loading />

  return (
    <SafeAreaProvider>
      <AppearanceProvider>
        <ThemeProvider>
          <ThemeProvider_LEGACY theme={DEFAULT_THEME_V0_LEGACY == 'default' ? theme : darkTheme}>
            {/* <Tamagui.Provider defaultTheme={DEFAULT_THEME_V2_BETA_TAMAGUI}> */}
            <StatusBar barStyle={statusBarStyle[DEFAULT_THEME_V0_LEGACY]} />
            <NavigationContainer {...navigationState.persistenceProps}>
              <AppStack.Navigator
                initialRouteName={
                  requiredPermissions.allPermissionsIsGranted ? 'App' : 'RequiredPermissions'
                }
                screenOptions={{ headerShown: false }}
              >
                <AppStack.Screen name="RequiredPermissions" component={RequiredPermissions} />
                <AppStack.Screen name="App">
                  {() => (
                    <RelayEnvironmentProvider environment={environment}>
                      <RecoilRoot>
                        {/* render a fallback while waiting recoil load async initial values (those where setSelf receives a Promise) */}
                        <Suspense fallback={<Loading />}>
                          <RootStackNavigator />
                        </Suspense>
                      </RecoilRoot>
                    </RelayEnvironmentProvider>
                  )}
                </AppStack.Screen>
              </AppStack.Navigator>
            </NavigationContainer>
            {/* </Tamagui.Provider> */}
          </ThemeProvider_LEGACY>
        </ThemeProvider>
      </AppearanceProvider>
    </SafeAreaProvider>
  )
}

const statusBarStyle: Record<ThemeName_V0_LEGACY, StatusBarStyle> = {
  default: 'dark-content',
  dark: 'light-content',
}
