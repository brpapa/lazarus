import { t } from '@metis/shared'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core'
import type { StackNavigationProp } from '@react-navigation/stack'
import React, { Suspense, useEffect } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useQueryLoader } from 'react-relay'
import { CloseIcon, HeartIcon, MaximizeIcon, MessageCircleIcon } from '~/icons_LEGACY'
import { Box } from '~/components/v0-legacy/atoms'
import Loading from '~/components/v0-legacy/Loading'
import MyButton from '~/components/v0-legacy/MyButton'
import type { RootStackParams } from '~/navigation/RootStackNavigator'
import type { IncidentDataQuery as IncidentDataQueryType } from '~/__generated__/IncidentDataQuery.graphql'
import IncidentDataQuery from '~/__generated__/IncidentDataQuery.graphql'
import { IncidentData } from './IncidentData'

export function Incident() {
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
