import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import type { AppStackParams } from '~/App'
import Box from '~/components/atomics/Box'
import Text from '~/components/atomics/Text'
import { useLocationPermissions } from '~/hooks/use-location-permissions'

export default function LocationPermissionsScreen() {
  const appNavigation = useNavigation<StackNavigationProp<AppStackParams, 'LocationPermissions'>>()

  const {
    isLoading,
    locationForegroundPermissionIsGranted,
    locationBackgroundPermissionIsGranted,
    requestLocationForegroundPermission,
    requestLocationBackgroundPermission,
  } = useLocationPermissions({
    onAllPermissionsWasGranted: () => appNavigation.push('App'),
  })

  if (isLoading) return null

  return (
    <Box flex={1} bg="background" alignItems="center" justifyContent="center">
      <Text>Please, provides the following permissions before use the app</Text>
      <Box>
        {!locationForegroundPermissionIsGranted && (
          <Text>
            Location foreground permission
            <Text variant="link" onPress={requestLocationForegroundPermission}>
              Grant
            </Text>
          </Text>
        )}
        {!locationBackgroundPermissionIsGranted && (
          <Text>
            Location background permission
            <Text variant="link" onPress={requestLocationBackgroundPermission}>
              Grant
            </Text>
          </Text>
        )}
      </Box>
    </Box>
  )
}
