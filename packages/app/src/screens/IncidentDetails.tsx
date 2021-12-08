import { Image } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core'
import type { StackNavigationProp } from '@react-navigation/stack'
import { ScrollView } from 'react-native-gesture-handler'
import React from 'react'
import type { RootStackParams } from '~/RootNavigator'
import { CloseIcon, MaximizeIcon, MessageCircleIcon, HeartIcon } from '~/assets/icons'
import intl from '~/shared/intl'
import { Box, Button, Text } from '~/components/atomics'
import RelativeInfo from '~/components/RelativeInfo'
import NotificationsAmount from '~/components/NotificationsAmount'
import { graphql, useLazyLoadQuery, useQueryLoader } from 'react-relay'
import type { IncidentDetailsQuery } from '~/__generated__/IncidentDetailsQuery.graphql'

export default function IncidentDetailsScreen() {
  const insets = useSafeAreaInsets()
  const homeNavigation = useNavigation<StackNavigationProp<RootStackParams, 'Home'>>()
  const route = useRoute<RouteProp<RootStackParams, 'IncidentDetails'>>()

  // TODO: trocar: botar num componente filho, pra que aqui eu o envolva com suspense
  const data = useLazyLoadQuery<IncidentDetailsQuery>(
    graphql`
      query IncidentDetailsQuery($id: String!) {
        incident(id: $id) {
          id
          title
          # createdAt
          coordinate {
            latitude
            longitude
          }
        }
      }
    `,
    { id: route.params.incidentId },
  )
  // console.log(data?.incident?.createdAt)

  return (
    <Box flex={1} flexDirection="column" bg="background">
      <ScrollView style={{ flex: 1, flexGrow: 9 }}>
        <Box>
          {/* TODO: image swiper com scroll view: https://www.youtube.com/watch?v=otr_x0wKgvU&t=679s */}
          {TEMPORARY_IMAGES_URI.map((imageUri, idx) => (
            <Image key={idx} source={{ uri: imageUri }} style={{ width: '100%', height: 400 }} />
          ))}
        </Box>
        <Box flex={1} m="md" bg="background">
          <RelativeInfo />

          <Text mt="md" variant="header">
            {data.incident?.title}
          </Text>
          <Text variant="subheader">{'Rua dos bobos, número 0'}</Text>

          {/* <NotificationsAmount my="xs" amount={data.incident?.notificationsAmount} /> */}

          <Text variant="title" mt="lg">
            {intl.updates}
          </Text>

          {/* <Box mb="md">
            {data.incident?.timelineUpdates.map((update, i) => (
              <Box key={i} mt="md">
                <Text variant="body2">{update.timestamp}</Text>
                <Text variant="body">{update.description}</Text>
              </Box>
            ))}
          </Box> */}
        </Box>
        <Box position="absolute" right={insets.right + 10} top={insets.top + 10}>
          <RoundedButton
            my={'sm'}
            justifyContent="center"
            alignItems="center"
            icon={CloseIcon}
            onPress={() => {
              homeNavigation.pop()
            }}
          />
          <Button my="$2" justifyContent="center" alignItems="center" icon={MaximizeIcon} />
        </Box>
      </ScrollView>
      <Box
        flexGrow={1}
        bg="background"
        mx="sm"
        flex={1}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Button p="sm" mx="sm" my="md" label={intl.react} icon={HeartIcon} />
        <Button p="sm" mx="sm" my="md" label={intl.comment} icon={MessageCircleIcon} />
      </Box>
    </Box>
  )
}

const TEMPORARY_IMAGES_URI = [
  // 'https://images.unsplash.com/photo-1628456610536-27762799df31?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1628422508335-6ed9ddb76316?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80',
  // 'https://images.unsplash.com/photo-1628383657590-e6bab094d913?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80',
]
