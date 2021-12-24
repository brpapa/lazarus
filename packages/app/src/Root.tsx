import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { useSession } from '~/hooks/use-session'
import { HomeScreen } from '~/screens/HomeScreen'
import IncidentScreen from '~/screens/IncidentScreen'
import SignInScreen from '~/screens/SignInScreen'
import SignUpScreen from '~/screens/SignUpScreen'
import { useOnNearbyIncidentCreatedSubscription } from '~/hooks/subscriptions/OnNearbyIncidentCreatedSubscription'

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
  useOnNearbyIncidentCreatedSubscription({ isOn: isSignedIn })

  return (
    <RootStack.Navigator initialRouteName={'Home'} screenOptions={{ headerShown: false }}>
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
