import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { ThemeProvider } from '@shopify/restyle'
import React, { Suspense } from 'react'
import { StatusBar, StatusBarStyle } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { RelayEnvironmentProvider } from 'react-relay'
import { RecoilRoot } from 'recoil'
import { App } from '~/App'
import { THEME_NAME } from '~/config'
import { environment } from '~/data/relay/environment'
import { darkTheme, theme } from '~/shared/theme'
import Loading from './components/Loading'
import { useInitialPermissions as useInitialPermissions } from './hooks/use-initial-permissions'
import { useNavigationStatePersistence } from './hooks/use-navigation-state-persistence'
import InitialPermissionsScreen from './screens/InitialPermissionsScreen'

export type AppWrapperStackParams = {
  InitialPermissions: undefined
  App: undefined
}

const AppWrapperStack = createStackNavigator<AppWrapperStackParams>()

export function AppContainer() {
  const requiredPermissions = useInitialPermissions()
  const navigationState = useNavigationStatePersistence()

  if (navigationState.isLoading || requiredPermissions.isLoading) return <Loading />

  return (
    <ThemeProvider theme={THEME_NAME == 'default' ? theme : darkTheme}>
      <NavigationContainer {...navigationState.persistenceProps}>
        <AppWrapperStack.Navigator
          initialRouteName={
            requiredPermissions.allPermissionsIsGranted ? 'App' : 'InitialPermissions'
          }
          screenOptions={{ headerShown: false }}
        >
          <AppWrapperStack.Screen name="InitialPermissions" component={InitialPermissionsScreen} />
          <AppWrapperStack.Screen name="App">
            {() => (
              <RelayEnvironmentProvider environment={environment}>
                <RecoilRoot>
                  {/* render a fallback while waiting recoil load async initial values (those where setSelf receives a Promise) */}
                  <Suspense fallback={<Loading />}>
                    <SafeAreaProvider>
                      <StatusBar barStyle={statusBarStyle[THEME_NAME]} />
                      <App />
                    </SafeAreaProvider>
                  </Suspense>
                </RecoilRoot>
              </RelayEnvironmentProvider>
            )}
          </AppWrapperStack.Screen>
        </AppWrapperStack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  )
}

const statusBarStyle: Record<ThemeName, StatusBarStyle> = {
  default: 'dark-content',
  dark: 'light-content',
}
