import { t } from '@metis/shared'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core'
import type { StackNavigationProp } from '@react-navigation/stack'
import React, { Suspense, useEffect } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useQueryLoader } from 'react-relay'
import { CloseIcon, HeartIcon, MaximizeIcon, MessageCircleIcon } from '~/assets/icons'
import { Box } from '~/components/atomics'
import Loading from '~/components/Loading'
import MyButton from '~/components/MyButton'
import type { RootStackParams } from '~/RootNavigator'
import type { IncidentDataQuery as IncidentDataQueryType } from '~/__generated__/IncidentDataQuery.graphql'
import IncidentDataQuery from '~/__generated__/IncidentDataQuery.graphql'
import { IncidentData } from './IncidentData'

export default function IncidentScreen() {
  const insets = useSafeAreaInsets()
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParams, 'Home'>>()
  const { params } = useRoute<RouteProp<RootStackParams, 'Incident'>>()

  const [preloadedQueryRef, loadQuery] = useQueryLoader<IncidentDataQueryType>(IncidentDataQuery)

  useEffect(() => {
    loadQuery({ incidentId: params.incidentId })
  }, [loadQuery, params.incidentId])

  return (
    <Box flex={1} flexDirection="column" bg="background">
      <ScrollView style={{ flex: 1, flexGrow: 9 }}>
        {preloadedQueryRef && (
          <Suspense fallback={<Loading />}>
            <IncidentData preloadedQueryRef={preloadedQueryRef} />
          </Suspense>
        )}
        <Box position="absolute" right={insets.right + 10} top={insets.top + 10}>
          <MyButton
            my={'sm'}
            justifyContent="center"
            alignItems="center"
            icon={CloseIcon}
            onPress={() => {
              rootNavigation.pop()
            }}
          />
          <MyButton my={'sm'} justifyContent="center" alignItems="center" icon={MaximizeIcon} />
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
        <MyButton p="sm" mx="sm" my="md" label={t('incident.reactButton')} icon={HeartIcon} />
        <MyButton
          p="sm"
          mx="sm"
          my="md"
          label={t('incident.commentButton')}
          icon={MessageCircleIcon}
        />
      </Box>
    </Box>
  )
}
