import React, { useCallback } from 'react'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import Box from '~/components/atomics/Box'
import RoundedButton from '~/components/RoundedButton'
import Text from '~/components/atomics/Text'
import CloseIcon from '~/assets/icons/close'
import RelativeInfo from '~/components/RelativeInfo'
import { graphql, PreloadedQuery, usePreloadedQuery } from 'react-relay'
import type { IncidentPreviewQuery } from '~/__generated__/IncidentPreviewQuery.graphql'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RootStackParams } from '~/RootNavigator'

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
        <RelativeInfo mb="sm" />

        {/* <NotificationsAmount amount={incident.notificationsAmount} /> */}

        {props.closeable && (
          <RoundedButton
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
