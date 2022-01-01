import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import type { AppStackParams } from '~/App'
import Box from '~/components/atomics/Box'
import Text from '~/components/atomics/Text'
import { useInitialPermissions } from '~/hooks/use-initial-permissions'

export default function RequiredPermissionsScreen() {
  const appNavigation = useNavigation<StackNavigationProp<AppStackParams, 'InitialPermissions'>>()

  const {
    isLoading,
    locationForegroundPermissionIsGranted,
    locationBackgroundPermissionIsGranted,
    pushNotificationPermissionIsGranted,
    requestLocationForegroundPermission,
    requestLocationBackgroundPermission,
    requestPushNotificationPermission,
  } = useInitialPermissions({
    onAllPermissionsWasGranted: () => appNavigation.push('App'),
  })

  if (isLoading) return null

  return (
    <Box flex={1} bg="background" alignItems="center" justifyContent="center">
      <Text>Please, provides the following permissions before use the app</Text>
      <Box>
        {[
          {
            isGranted: locationForegroundPermissionIsGranted,
            label: 'Location foreground permission',
            requestPermission: requestLocationForegroundPermission,
          },
          {
            isGranted: locationBackgroundPermissionIsGranted,
            label: 'Location background permission',
            requestPermission: requestLocationBackgroundPermission,
          },
          {
            isGranted: pushNotificationPermissionIsGranted,
            label: 'Push notifications permission',
            requestPermission: requestPushNotificationPermission,
          },
        ]
          .filter(({ isGranted }) => !isGranted)
          .map(({ label, requestPermission }, key) => (
            <Text key={key}>
              {label}
              <Text variant="link" onPress={requestPermission}>
                Grant
              </Text>
            </Text>
          ))}
      </Box>
    </Box>
  )
}
