import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import { useEffect } from 'react'
import { useSession } from '~/hooks/use-session'
import type { MainStackParams } from '~/navigation/MainStackNavigator'
import { startBackgroundLocationTracking } from '../data/background-tasks/background-location-tracking'

export function Setup() {
  const { isSignedIn } = useSession()

  const { reset } = useNavigation<StackNavigationProp<MainStackParams, 'Setup'>>()

  useEffect(() => {
    if (isSignedIn) {
      startBackgroundLocationTracking()
    }
  }, [isSignedIn])

  useEffect(() => {
    if (isSignedIn) {
      reset({ index: 0, routes: [{ name: 'HomeTabNavigator' }] })
    } else {
      reset({ index: 0, routes: [{ name: 'SignIn' }] })
    }
  }, [reset, isSignedIn])

  return null

  // if (!loading) return null
  // return <Loading />
}
