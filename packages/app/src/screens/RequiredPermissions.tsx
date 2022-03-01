import { t } from '@lazarus/shared'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { View } from 'react-native'
import { Text } from '~/components/v1'
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
      <Text>{t('permissions.title') as string}</Text>
      <View>
        {[
          {
            isGranted: locationForegroundPermissionIsGranted,
            label: t('permissions.locationForeground'),
            requestPermission: requestLocationForegroundPermission,
          },
          {
            isGranted: locationBackgroundPermissionIsGranted,
            label: t('permissions.locationBackground'),
            requestPermission: requestLocationBackgroundPermission,
          },
          {
            isGranted: pushNotificationPermissionIsGranted,
            label: t('permissions.pushNotifications'),
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
