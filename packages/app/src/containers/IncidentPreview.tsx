import React, { useCallback } from 'react'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import CloseIcon from '~/assets/icons/close'
import RelativeInfo from '~/components/RelativeInfo'
import { graphql, PreloadedQuery, usePreloadedQuery } from 'react-relay'
import type { IncidentPreviewQuery } from '~/__generated__/IncidentPreviewQuery.graphql'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParams } from '~/RootNavigator'
import { XStack, Button, H1 } from '~/components/atomics'

type IncidentPreviewProps = {
  preloadedQueryRef: PreloadedQuery<IncidentPreviewQuery>
  closeable: boolean
  onClosed?: () => void
}

export default function IncidentPreview(props: IncidentPreviewProps) {
  if (!props.closeable && props.onClosed)
    throw new Error('Invalid props: component should be closeable to have the onClosed prop')

  const rootNavigation = useNavigation<StackNavigationProp<RootStackParams, 'Home'>>()

  const data = usePreloadedQuery<IncidentPreviewQuery>(
    graphql`
      query IncidentPreviewQuery($id: String!) {
        incident(id: $id) {
          incidentId
          title
        }
      }
    `,
    props.preloadedQueryRef,
  )

  const onTouched = useCallback(() => {
    rootNavigation.push('IncidentDetails', {
      incidentId: data.incident?.incidentId!,
    })
  }, [])

  return (
    <TouchableWithoutFeedback onPress={onTouched}>
      <XStack
        flex={1}
        bg="$bg"
        m="sm"
        px="md"
        py="sm"
        borderRadius={5}
        borderColor="accents-2"
        borderWidth={1}
      >
        <H1>{data.incident?.title}</H1>
        <RelativeInfo mb="sm" />

        {/* <NotificationsAmount amount={incident.notificationsAmount} /> */}

        {props.closeable && (
          <XStack fullscreen flexDirection="end">
            <Button size="$2" icon={CloseIcon} onPress={props.onClosed} />
          </XStack>
        )}
      </XStack>
    </TouchableWithoutFeedback>
  )
}
