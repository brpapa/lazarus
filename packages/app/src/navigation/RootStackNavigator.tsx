import { t } from '@lazarus/shared'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { IncidentComments, ReportIncident } from '~/screens'
import { DistanceRadiusPreference, ColorSchemePreference } from '~/screens'
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
        name="ReportIncident"
        component={ReportIncident}
        options={{ title: '', ...navModal }}
      />
      <RootStack.Screen
        name="IncidentComments"
        component={IncidentComments}
        options={{ title: '', ...navModal }}
      />
      <RootStack.Screen
        name="ColorSchemePreference"
        component={ColorSchemePreference}
        options={{ title: t('colorScheme'), ...navModal }}
      />
      <RootStack.Screen
        name="DistanceRadiusPreference"
        component={DistanceRadiusPreference}
        options={{ title: t('colorScheme'), ...navModal }}
      />
    </RootStack.Navigator>
  )
}
