import { RouteProp, useNavigation, useRoute } from '@react-navigation/core'
import type { StackNavigationProp } from '@react-navigation/stack'
import React, { Suspense, useEffect } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useQueryLoader } from 'react-relay'
import { CloseIcon, HeartIcon, MaximizeIcon, MessageCircleIcon } from '~/assets/icons'
import { Box } from '~/components/atomics'
import Loading from '~/components/Loading'
import RoundedButton from '~/components/RoundedButton'
import type { RootStackParams } from '~/RootNavigator'
import intl from '~/shared/intl'
import type { IncidentDataQuery as IncidentDataQueryType } from '~/__generated__/IncidentDataQuery.graphql'
import IncidentDataQuery from '~/__generated__/IncidentDataQuery.graphql'
import { IncidentData } from './IncidentData'

export default function IncidentScreen() {
  const insets = useSafeAreaInsets()
  const homeNavigation = useNavigation<StackNavigationProp<RootStackParams, 'Home'>>()
  const route = useRoute<RouteProp<RootStackParams, 'Incident'>>()

  const [preloadedQueryRef, loadQuery] = useQueryLoader<IncidentDataQueryType>(IncidentDataQuery)

  useEffect(() => {
    loadQuery({ incidentId: route.params.incidentId })
  }, [loadQuery, route.params.incidentId])

  return (
    <Box flex={1} flexDirection="column" bg="background">
      <ScrollView style={{ flex: 1, flexGrow: 9 }}>
        {preloadedQueryRef && (
          <Suspense fallback={<Loading />}>
            <IncidentData preloadedQueryRef={preloadedQueryRef} />
          </Suspense>
        )}
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
          <RoundedButton
            my={'sm'}
            justifyContent="center"
            alignItems="center"
            icon={MaximizeIcon}
          />
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
        <RoundedButton p="sm" mx="sm" my="md" label={intl.react} icon={HeartIcon} />
        <RoundedButton p="sm" mx="sm" my="md" label={intl.comment} icon={MessageCircleIcon} />
      </Box>
    </Box>
  )
}
