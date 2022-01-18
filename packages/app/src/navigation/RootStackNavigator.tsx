import { t } from '@metis/shared'
import { createStackNavigator } from '@react-navigation/stack'
import React, { Suspense, useEffect } from 'react'
import { useQueryLoader } from 'react-relay'
import { useOnNearbyIncidentCreatedSubscription } from '~/data/relay/subscriptions/OnNearbyIncidentCreatedSubscription'
import { usePushNotificationsListener } from '~/hooks/use-push-notifications-listener'
import { useSession } from '~/hooks/use-session'
import { Incident, SignIn, SignUp } from '~/screens'
import type { HomeTabNavigatorQuery as HomeTabNavigatorQueryType } from '~/__generated__/HomeTabNavigatorQuery.graphql'
import HomeTabNavigatorQuery from '~/__generated__/HomeTabNavigatorQuery.graphql'
import Loading from '../components/v0-legacy/Loading'
import { startBackgroundLocationTracking } from '../data/background-tasks/background-location-tracking'
import { HomeTabNavigator } from './HomeTabNavigator'

export type RootStackParams = {
  Home: undefined
  Incident: {
    incidentId: string
  }
  SignIn: undefined
  SignUp: undefined
}

const RootStack = createStackNavigator<RootStackParams>()

export function RootStackNavigator() {
  const { isSignedIn } = useSession()

  useOnNearbyIncidentCreatedSubscription({ when: isSignedIn })
  usePushNotificationsListener({ when: isSignedIn })

  const [homeScreenQueryRef, loadHomeTabNavigatorQuery] =
    useQueryLoader<HomeTabNavigatorQueryType>(HomeTabNavigatorQuery)

  useEffect(() => {
    if (isSignedIn) {
      loadHomeTabNavigatorQuery({}, { fetchPolicy: 'network-only' })
      startBackgroundLocationTracking()
    }
  }, [isSignedIn])

  return (
    <RootStack.Navigator initialRouteName={isSignedIn ? 'Home' : 'SignIn'}>
      {isSignedIn ? (
        <>
          <RootStack.Screen name="Home" options={{ headerShown: false }}>
            {() =>
              homeScreenQueryRef && (
                <Suspense fallback={<Loading />}>
                  <HomeTabNavigator preloadedQuery={homeScreenQueryRef} />
                </Suspense>
              )
            }
          </RootStack.Screen>
          <RootStack.Screen name="Incident" component={Incident} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <RootStack.Screen
            name="SignIn"
            component={SignIn}
            options={{ title: t('auth.signIn'), animationTypeForReplace: 'pop', headerShown: true }}
          />
          <RootStack.Screen
            name="SignUp"
            component={SignUp}
            options={{ title: t('auth.signUp'), headerShown: true }}
          />
        </>
      )}
    </RootStack.Navigator>
  )
}
