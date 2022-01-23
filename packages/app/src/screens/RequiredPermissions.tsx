import { t } from '@metis/shared'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { View } from 'react-native'
import { Text } from '~/components/v1/atoms'
import { useRequiredPermissions } from '~/hooks/use-required-permissions'
import type { AppStackParams } from '~/navigation/types'

export function RequiredPermissions() {
  const nav = useNavigation<StackNavigationProp<AppStackParams, 'RequiredPermissions'>>()

  const {
    isLoading,
    locationForegroundPermissionIsGranted,
    locationBackgroundPermissionIsGranted,
    pushNotificationPermissionIsGranted,
    requestLocationForegroundPermission,
    requestLocationBackgroundPermission,
    requestPushNotificationPermission,
  } = useRequiredPermissions({
    onAllPermissionsWasGranted: () =>
      nav.reset({ index: 0, routes: [{ name: 'RootStackNavigator' }] }),
  })

  if (isLoading) return null

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{t('Please, provides the following permissions before use the app') as string}</Text>
      <View>
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
      </View>
    </View>
  )
}
