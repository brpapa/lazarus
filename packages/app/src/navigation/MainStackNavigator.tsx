import { t } from '@metis/shared'
import { createStackNavigator } from '@react-navigation/stack'
import React, { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { startBackgroundLocationTracking } from '~/data/background-tasks/background-location-tracking'
import { preferencesUserRefState } from '~/data/recoil/preferences-user-ref'
import { useOnNearbyIncidentCreatedSubscription } from '~/data/relay/subscriptions/OnNearbyIncidentCreatedSubscription'
import { usePushNotificationsListener } from '~/hooks/use-push-notifications-listener'
import { useSession } from '~/hooks/use-session'
import { IncidentDetail, Notifications, Preferences, SignIn, SignUp } from '~/screens'
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

  const preferencesUserRef = useRecoilValue(preferencesUserRefState)

  return (
    <MainStack.Navigator
      mode={'card'}
      initialRouteName={isSignedIn ? 'HomeTabNavigator' : 'SignIn'}
    >
      {isSignedIn ? (
        <>
          <MainStack.Screen
            name="HomeTabNavigator"
            component={HomeTabNavigator}
            options={{ headerShown: false }}
          />
          <MainStack.Screen
            name="IncidentDetail"
            component={IncidentDetail}
            options={{ headerShown: false }}
          />
          <MainStack.Screen
            name="Notifications"
            component={Notifications}
            options={{ title: t('notification.header'), ...navHeader }}
          />
          {preferencesUserRef && (
            <MainStack.Screen
              name="Preferences"
              options={{ title: t('Preferences'), ...navHeader }}
            >
              {(props) => <Preferences userRef={preferencesUserRef} {...props} />}
            </MainStack.Screen>
          )}
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
