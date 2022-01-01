import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { ThemeProvider } from '@shopify/restyle'
import React, { Suspense, useEffect } from 'react'
import { StatusBar, StatusBarStyle } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { RelayEnvironmentProvider } from 'react-relay'
import { RecoilRoot } from 'recoil'
import { THEME_NAME } from '~/config'
import { environment } from '~/data/relay/environment'
import Root from '~/Root'
import { darkTheme, theme } from '~/shared/theme'
import Loading from './components/Loading'
import { startLocationTracking } from './data/background-tasks/background-location-tracking'
import { useInitialPermissions as useInitialPermissions } from './hooks/use-initial-permissions'
import { useNavigationStatePersistence } from './hooks/use-navigation-state-persistence'
import InitialPermissionsScreen from './screens/InitialPermissionsScreen'

export type AppStackParams = {
  InitialPermissions: undefined
  App: undefined
}

const AppStack = createStackNavigator<AppStackParams>()

export default function App() {
  const requiredPermissions = useInitialPermissions()
  const navigationState = useNavigationStatePersistence()

  useEffect(() => {
    if (requiredPermissions.allPermissionsIsGranted) startLocationTracking()
  }, [requiredPermissions.allPermissionsIsGranted])

  if (navigationState.isLoading || requiredPermissions.isLoading) return <Loading />

  return (
    <ThemeProvider theme={THEME_NAME == 'default' ? theme : darkTheme}>
      <NavigationContainer {...navigationState.persistenceProps}>
        <AppStack.Navigator
          initialRouteName={
            requiredPermissions.allPermissionsIsGranted ? 'App' : 'InitialPermissions'
          }
          screenOptions={{ headerShown: false }}
        >
          <AppStack.Screen name="InitialPermissions" component={InitialPermissionsScreen} />
          <AppStack.Screen name="App">
            {() => (
              <RelayEnvironmentProvider environment={environment}>
                <RecoilRoot>
                  {/* render a fallback while waiting recoil load async initial values (those where setSelf receives a Promise) */}
                  <Suspense fallback={<Loading />}>
                    <SafeAreaProvider>
                      <StatusBar barStyle={statusBarStyle[THEME_NAME]} />
                      <Root />
                    </SafeAreaProvider>
                  </Suspense>
                </RecoilRoot>
              </RelayEnvironmentProvider>
            )}
          </AppStack.Screen>
        </AppStack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  )
}

const statusBarStyle: Record<ThemeName, StatusBarStyle> = {
  default: 'dark-content',
  dark: 'light-content',
}
