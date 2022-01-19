import { t } from '@metis/shared'
import { createStackNavigator } from '@react-navigation/stack'
import React, { Suspense } from 'react'
import { Loading } from '~/components/v1/atoms'
import { Incident, Setup, SignIn, SignUp } from '~/screens'
import { useTheme } from '~/theme/v1'
import { HomeTabNavigator } from './HomeTabNavigator'

export type MainStackParams = {
  Setup: undefined
  HomeTabNavigator: undefined
  Incident: {
    incidentId: string
  }
  SignIn: undefined
  SignUp: undefined
}

const MainStack = createStackNavigator<MainStackParams>()

export function MainStackNavigator() {
  const { navHeader } = useTheme()

  return (
    <MainStack.Navigator mode={'card'} initialRouteName={'Setup'}>
      <MainStack.Screen name="Setup" component={Setup} options={{ headerShown: false }} />
      <MainStack.Screen name="HomeTabNavigator" options={{ headerShown: false }}>
        {(props) => (
          <Suspense fallback={<Loading />}>
            <HomeTabNavigator {...props} />
          </Suspense>
        )}
      </MainStack.Screen>
      <MainStack.Screen
        name="Incident"
        component={Incident}
        options={{ title: '', headerShown: false }}
      />
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
    </MainStack.Navigator>
  )
}
