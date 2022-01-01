import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { useOnNearbyIncidentCreatedSubscription } from '~/data/relay/subscriptions/OnNearbyIncidentCreatedSubscription'
import { useSession } from '~/hooks/use-session'
import { usePushNotificationsListener } from '~/hooks/use-push-notifications-listener'
import { HomeScreen } from '~/screens/HomeScreen'
import IncidentScreen from '~/screens/IncidentScreen'
import SignInScreen from '~/screens/SignInScreen'
import SignUpScreen from '~/screens/SignUpScreen'

export type RootStackParams = {
  Home: undefined
  Incident: {
    incidentId: string
  }
  SignIn: undefined
  SignUp: undefined
}

const RootStack = createStackNavigator<RootStackParams>()

export default function Root() {
  const { isSignedIn } = useSession()

  useOnNearbyIncidentCreatedSubscription({ when: isSignedIn })
  usePushNotificationsListener({ when: isSignedIn })

  return (
    <RootStack.Navigator initialRouteName={isSignedIn ? 'Home' : 'SignIn'} screenOptions={{ headerShown: false }}>
      {isSignedIn ? (
        <>
          <RootStack.Screen name="Home" component={HomeScreen} />
          <RootStack.Screen name="Incident" component={IncidentScreen} />
        </>
      ) : (
        <>
          <RootStack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{ title: 'Sign in', animationTypeForReplace: 'pop' }}
          />
          <RootStack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign up' }} />
        </>
      )}
    </RootStack.Navigator>
  )
}
