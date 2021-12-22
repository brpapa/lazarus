import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { ThemeProvider } from '@shopify/restyle'
import React, { Suspense, useEffect } from 'react'
import { StatusBar, StatusBarStyle } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { RelayEnvironmentProvider } from 'react-relay'
import { RecoilRoot } from 'recoil'
import { environment } from '~/data/relay/environment'
import Root from '~/Root'
import { THEME_NAME } from '~/shared/config'
import { darkTheme, theme } from '~/shared/theme'
import Loading from './components/Loading'
import { startLocationTracking } from './data/background-tasks/location-tracking'
import { useLocationPermissions } from './hooks/use-location-permissions'
import { useNavigationStatePersistence } from './hooks/use-navigation-state-persistence'
import LocationPermissionsScreen from './screens/LocationPermissionsScreen'

export type AppStackParams = {
  LocationPermissions: undefined
  App: undefined
}

const AppStack = createStackNavigator<AppStackParams>()

export default function App() {
  const locationPermissions = useLocationPermissions()
  const navigationState = useNavigationStatePersistence()

  useEffect(() => {
    if (locationPermissions.allPermissionsIsGranted) startLocationTracking()
  }, [locationPermissions.allPermissionsIsGranted])

  if (navigationState.isLoading || locationPermissions.isLoading) return <Loading />

  return (
    <ThemeProvider theme={THEME_NAME == 'default' ? theme : darkTheme}>
      <NavigationContainer {...navigationState.persistenceProps}>
        <RelayEnvironmentProvider environment={environment}>
          <AppStack.Navigator
            initialRouteName={
              locationPermissions.allPermissionsIsGranted ? 'App' : 'LocationPermissions'
            }
            screenOptions={{ headerShown: false }}
          >
            <AppStack.Screen name="LocationPermissions" component={LocationPermissionsScreen} />
            <AppStack.Screen name="App">
              {() => (
                <RecoilRoot>
                  {/* show a fallback while waiting for recoil load async values (those where setSelf receives a Promise) */}
                  <Suspense fallback={<Loading />}>
                    <SafeAreaProvider>
                      <StatusBar barStyle={statusBarStyle[THEME_NAME]} />
                      <Root />
                    </SafeAreaProvider>
                  </Suspense>
                </RecoilRoot>
              )}
            </AppStack.Screen>
          </AppStack.Navigator>
        </RelayEnvironmentProvider>
      </NavigationContainer>
    </ThemeProvider>
  )
}

const statusBarStyle: Record<ThemeName, StatusBarStyle> = {
  default: 'dark-content',
  dark: 'light-content',
}
