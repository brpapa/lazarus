import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { useNavigationStatePersistence } from '~/hooks/use-navigation-state-persistence'
import { useSession } from '~/hooks/use-session'
import { HomeScreen } from '~/screens/HomeScreen'
import IncidentScreen from '~/screens/IncidentScreen'
import SignInScreen from '~/screens/SignInScreen'
import SignUpScreen from '~/screens/SignUpScreen'
import Loading from './components/Loading'

export type RootStackParams = {
  Home: undefined
  Incident: {
    incidentId: string
  }
  SignIn: undefined
  SignUp: undefined
  NotFound: undefined
}

const RootStack = createStackNavigator<RootStackParams>()

export default function RootNavigator() {
  const { isSignedIn } = useSession()
  const { isLoading, persistenceProps } = useNavigationStatePersistence()

  if (isLoading) return <Loading />

  return (
    <NavigationContainer {...persistenceProps}>
      <RootStack.Navigator initialRouteName="Home">
        {isSignedIn ? (
          <>
            <RootStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <RootStack.Screen
              name="Incident"
              component={IncidentScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <RootStack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{ title: 'Sign in', animationTypeForReplace: 'pop', headerShown: false }}
            />
            <RootStack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ title: 'Sign up', headerShown: false }}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  )
}
