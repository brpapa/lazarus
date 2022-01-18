import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import type { AppStackParams } from '~/App'
import Box from '~/components/v0-legacy/atoms/Box'
import Text from '~/components/v0-legacy/atoms/Text'
import { useRequiredPermissions } from '~/hooks/use-required-permissions'

export function RequiredPermissions() {
  const appNavigation = useNavigation<StackNavigationProp<AppStackParams, 'RequiredPermissions'>>()

  const {
    isLoading,
    locationForegroundPermissionIsGranted,
    locationBackgroundPermissionIsGranted,
    pushNotificationPermissionIsGranted,
    requestLocationForegroundPermission,
    requestLocationBackgroundPermission,
    requestPushNotificationPermission,
  } = useRequiredPermissions({
    onAllPermissionsWasGranted: () => appNavigation.reset({ index: 0, routes: [{ name: 'App' }] }),
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
