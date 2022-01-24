import { t } from '@metis/shared'
import { createStackNavigator } from '@react-navigation/stack'
import React, { Suspense, useEffect } from 'react'
import { Loading } from '~/components/v1/atoms'
import { startBackgroundLocationTracking } from '~/data/background-tasks/background-location-tracking'
import { useOnNearbyIncidentCreatedSubscription } from '~/data/relay/subscriptions/OnNearbyIncidentCreatedSubscription'
import { usePushNotificationsListener } from '~/hooks/use-push-notifications-listener'
import { useSession } from '~/hooks/use-session'
import { IncidentDetail, Notifications, SignIn, SignUp } from '~/screens'
import { useTheme } from '~/theme/v1'
import { HomeTabNavigator } from './HomeTabNavigator'
import type { MainStackParams } from './types'

const MainStack = createStackNavigator<MainStackParams>()

export function MainStackNavigator() {
  const { navHeader } = useTheme()
  const { isSignedIn } = useSession()
  
  useOnNearbyIncidentCreatedSubscription({ when: isSignedIn })
  usePushNotificationsListener({ when: isSignedIn })

  useEffect(() => {
    if (isSignedIn) {
      startBackgroundLocationTracking()
    }
  }, [isSignedIn])

  return (
    <MainStack.Navigator
      mode={'card'}
      initialRouteName={isSignedIn ? 'HomeTabNavigator' : 'SignIn'}
    >
      {isSignedIn ? (
        <>
          <MainStack.Screen name="HomeTabNavigator" options={{ headerShown: false }}>
            {(props) => (
              <Suspense fallback={<Loading />}>
                <HomeTabNavigator {...props} />
              </Suspense>
            )}
          </MainStack.Screen>
          <MainStack.Screen
            name="IncidentDetail"
            component={IncidentDetail}
            options={{ headerShown: false }}
          />
          <MainStack.Screen
            name="Notifications"
            component={Notifications}
            options={{ title: t('notification.title'), headerShown: true, ...navHeader }}
          />
        </>
      ) : (
        <>
          <MainStack.Screen
            name="SignIn"
            component={SignIn}
            options={{ title: t('auth.signIn'), animationTypeForReplace: 'pop', ...navHeader }}
          />
          <MainStack.Screen
            name="SignUp"
            component={SignUp}
            options={{ title: t('auth.signUp'), ...navHeader }}
          />
        </>
      )}
    </MainStack.Navigator>
  )
}
