import { t } from '@metis/shared'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback } from 'react'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { graphql, PreloadedQuery, usePreloadedQuery } from 'react-relay'
import { useRecoilValue } from 'recoil'
import CloseIcon from '~/assets/icons/close'
import Box from '~/components/atomics/Box'
import Text from '~/components/atomics/Text'
import MyButton from '~/components/MyButton'
import NotificationsAmount from '~/components/NotificationsAmount'
import { userLocationState } from '~/data/recoil'
import type { RootStackParams } from '~/RootNavigator'
import type { IncidentPreviewQuery as IncidentPreviewQueryType } from '~/__generated__/IncidentPreviewQuery.graphql'

type IncidentPreviewProps = {
  preloadedQuery: PreloadedQuery<IncidentPreviewQueryType>
  closeable: boolean
  onClosed?: () => void
}

export default function IncidentPreview(props: IncidentPreviewProps) {
  if (!props.closeable && props.onClosed)
    throw new Error('Invalid props: component should be closeable to have the onClosed prop')

  const rootNavigation = useNavigation<StackNavigationProp<RootStackParams, 'Home'>>()
  const userLocation = useRecoilValue(userLocationState)

  const data = usePreloadedQuery<IncidentPreviewQueryType>(
    graphql`
      query IncidentPreviewQuery($id: String!) {
        incident(incidentId: $id) {
          incidentId
          title
          location {
            latitude
            longitude
          }
          usersNotifiedCount
          createdAt
        }
      }
    `,
    props.preloadedQuery,
  )

  const onTouched = useCallback(() => {
    rootNavigation.push('Incident', {
      incidentId: data.incident?.incidentId!,
    })
  }, [])

  return (
    <TouchableWithoutFeedback onPress={onTouched}>
      <Box
        flex={1}
        bg="background"
        m="sm"
        px="md"
        py="sm"
        borderRadius={5}
        borderColor="accents-2"
        borderWidth={1}
      >
        <Text variant="header">{data.incident?.title}</Text>
        <Box flex={1} flexDirection="row" mb="sm">
          <Text variant="body2">
            {t('incident.createdAt', {
              createdAt: new Date(data!.incident!.createdAt),
            })}
          </Text>
          <Text mx="sm" variant="body2">
            {'·'}
          </Text>
          <Text variant="body2">
            {t('incident.distanceToUser', { segment: [data.incident!.location, userLocation] })}
          </Text>
        </Box>

        <NotificationsAmount amount={data!.incident!.usersNotifiedCount} />

        {props.closeable && (
          <MyButton
            position="absolute"
            width={40}
            height={40}
            top={-40 - 5}
            right={0}
            icon={CloseIcon}
            onPress={props.onClosed}
          />
        )}
      </Box>
    </TouchableWithoutFeedback>
  )
}
