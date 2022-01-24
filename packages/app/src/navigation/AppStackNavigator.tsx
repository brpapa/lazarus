import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { default as React, Suspense } from 'react'
import { StatusBar, StatusBarStyle } from 'react-native'
import { RelayEnvironmentProvider } from 'react-relay'
import { RecoilRoot } from 'recoil'
import { environment } from '~/data/relay/environment'
import { useNavigationStatePersistence } from '~/hooks/use-navigation-state-persistence'
import { useRequiredPermissions } from '~/hooks/use-required-permissions'
import { RootStackNavigator } from '~/navigation/RootStackNavigator'
import type { ColorScheme } from '~/theme/v1/helpers/color-scheme'
import { useColorScheme } from '~/theme/v1/contexts/ColorScheme'
import { Loading } from '~/components/v1/atoms'
import { RequiredPermissions } from '~/screens'
import type { AppStackParams } from '~/navigation/types'

const AppStack = createStackNavigator<AppStackParams>()

export function AppStackNavigator() {
  const { colorScheme } = useColorScheme()
  const requiredPermissions = useRequiredPermissions()
  const navigationState = useNavigationStatePersistence()

  if (navigationState.isLoading || requiredPermissions.isLoading) return <Loading />

  return (
    <>
      <StatusBar barStyle={statusBarStyle[colorScheme]} />
      <NavigationContainer {...navigationState.persistenceProps}>
        <AppStack.Navigator
          initialRouteName={
            requiredPermissions.allPermissionsIsGranted
              ? 'RootStackNavigator'
              : 'RequiredPermissions'
          }
          screenOptions={{ headerShown: false }}
        >
          <AppStack.Screen name="RequiredPermissions" component={RequiredPermissions} />
          <AppStack.Screen name="RootStackNavigator">
            {() => (
              <RelayEnvironmentProvider environment={environment}>
                <RecoilRoot>
                  {/* render a fallback while waiting recoil load async initial values (those atoms where setSelf receives a Promise) */}
                  <Suspense fallback={<Loading />}>
                    <RootStackNavigator />
                  </Suspense>
                </RecoilRoot>
              </RelayEnvironmentProvider>
            )}
          </AppStack.Screen>
        </AppStack.Navigator>
      </NavigationContainer>
    </>
  )
}

const statusBarStyle: Record<ColorScheme, StatusBarStyle> = {
  'no-preference': 'dark-content',
  light: 'dark-content',
  dark: 'light-content',
}
