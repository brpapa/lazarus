import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { HomeScreen } from '~/screens/Home'
import NotFoundScreen from '~/screens/NotFound'
import LoginScreen from '~/screens/Login'
import IncidentDetailsScreen from '~/screens/IncidentDetails'

export type RootStackParams = {
  Home: undefined
  IncidentDetails: {
    incidentId: string
  }
  Login: undefined
  NotFound: undefined
}

const RootStack = createStackNavigator<RootStackParams>()

export default function RootNavigator() {
  const [isLogged] = useState(true)

  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Home" >
        {isLogged ? (
          <>
            <RootStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <RootStack.Screen
              name="IncidentDetails"
              component={IncidentDetailsScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <RootStack.Screen name="Login" component={LoginScreen} />
            <RootStack.Screen name="NotFound" component={NotFoundScreen} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  )
}
