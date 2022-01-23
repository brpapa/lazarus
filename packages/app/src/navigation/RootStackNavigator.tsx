import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { IncidentComments } from '~/screens'
import { useTheme } from '~/theme/v1'
import { MainStackNavigator } from './MainStackNavigator'
import type { RootStackParams } from './types'

const RootStack = createStackNavigator<RootStackParams>()

export function RootStackNavigator() {
  const { navHeader, navModal, navNoShadow } = useTheme()

  return (
    <RootStack.Navigator mode={'modal'} initialRouteName={'Main'}>
      <RootStack.Screen
        name="Main"
        component={MainStackNavigator}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="IncidentComments"
        component={IncidentComments}
        options={{ title: '', ...navModal }}
      />
    </RootStack.Navigator>
  )
}
