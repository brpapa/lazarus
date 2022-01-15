import { t } from '@metis/shared'
import { createStackNavigator } from '@react-navigation/stack'
import React, { Suspense, useEffect } from 'react'
import { useQueryLoader } from 'react-relay'
import { useOnNearbyIncidentCreatedSubscription } from '~/data/relay/subscriptions/OnNearbyIncidentCreatedSubscription'
import { usePushNotificationsListener } from '~/hooks/use-push-notifications-listener'
import { useSession } from '~/hooks/use-session'
import { HomeScreen } from '~/screens/HomeScreen'
import IncidentScreen from '~/screens/IncidentScreen'
import SignInScreen from '~/screens/SignInScreen'
import SignUpScreen from '~/screens/SignUpScreen'
import type { HomeScreenQuery as HomeScreenQueryType } from '~/__generated__/HomeScreenQuery.graphql'
import HomeScreenQuery from '~/__generated__/HomeScreenQuery.graphql'
import Loading from './components/Loading'
import { startBackgroundLocationTracking } from './data/background-tasks/background-location-tracking'

export type RootStackParams = {
  Home: undefined
  Incident: {
    incidentId: string
  }
  SignIn: undefined
  SignUp: undefined
}

const RootStack = createStackNavigator<RootStackParams>()

export function App() {
  const { isSignedIn } = useSession()

  useOnNearbyIncidentCreatedSubscription({ when: isSignedIn })
  usePushNotificationsListener({ when: isSignedIn })

  const [homeScreenQueryRef, loadHomeScreenQuery] =
    useQueryLoader<HomeScreenQueryType>(HomeScreenQuery)

  useEffect(() => {
    if (isSignedIn) {
      loadHomeScreenQuery({}, { fetchPolicy: 'network-only' })
      startBackgroundLocationTracking()
    }
  }, [isSignedIn])

  return (
    <RootStack.Navigator
      initialRouteName={isSignedIn ? 'Home' : 'SignIn'}
      screenOptions={{ headerShown: false }}
    >
      {isSignedIn ? (
        <>
          <RootStack.Screen name="Home">
            {() =>
              homeScreenQueryRef && (
                <Suspense fallback={<Loading />}>
                  <HomeScreen preloadedQuery={homeScreenQueryRef} />
                </Suspense>
              )
            }
          </RootStack.Screen>
          <RootStack.Screen name="Incident" component={IncidentScreen} />
        </>
      ) : (
        <>
          <RootStack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{ title: t('signIn'), animationTypeForReplace: 'pop' }}
          />
          <RootStack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ title: t('signUp') }}
          />
        </>
      )}
    </RootStack.Navigator>
  )
}
