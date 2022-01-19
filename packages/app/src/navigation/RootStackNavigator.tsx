import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { Profile } from '~/screens'
import { useTheme } from '~/theme/v1'
import { MainStackNavigator } from './MainStackNavigator'

export type RootStackParams = {
  Main: undefined
  ReportIncident: undefined
}

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
        name="ReportIncident"
        component={Profile}
        options={{ title: 'Report a new incident', ...navHeader, ...navNoShadow }}
      />
    </RootStack.Navigator>
  )
}
