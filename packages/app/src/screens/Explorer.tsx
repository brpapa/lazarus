import React, { Suspense, useEffect, useState } from 'react'
import MapView from '~/containers/MapView'
import IncidentPreview from '~/containers/IncidentPreview'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '~/shared/config'
import { useQueryLoader } from 'react-relay'
import type { IncidentPreviewQuery } from '~/__generated__/IncidentPreviewQuery.graphql'
import incidentPreviewQuery from '~/__generated__/IncidentPreviewQuery.graphql'
import { useRecoilState } from 'recoil'
import { selectedIncidentIdInMap } from '~/data/recoil'
import Loading from '~/components/Loading'
import { XStack } from '~/components/atomics'

export default function ExplorerScreen() {
  // const homeNavigation = useNavigation<BottomTabNavigationProp<HomeBottomTabParams, 'Explorer'>>()

  const [selectedIncidentId, setSelectedIncidentId] = useRecoilState(selectedIncidentIdInMap)
  const someIncidentIsSelected = selectedIncidentId !== null

  // queryRef has value after the loadQuery call
  const [preloadedQueryRef, loadQuery] = useQueryLoader<IncidentPreviewQuery>(incidentPreviewQuery)

  useEffect(() => {
    if (selectedIncidentId === null) return
    loadQuery({ id: selectedIncidentId })
  }, [loadQuery, selectedIncidentId])

  return (
    <XStack flex={1} bg="$bg" width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
      <MapView />
      <XStack position="absolute" bottom={0} width={'100%'}>
        {someIncidentIsSelected && preloadedQueryRef ? (
          <Suspense fallback={<Loading />}>
            <IncidentPreview
              preloadedQueryRef={preloadedQueryRef}
              closeable={true}
              onClosed={() => setSelectedIncidentId(null)}
            />
          </Suspense>
        ) : (
          <XStack />
          // <NearbyHighlights />
        )}
      </XStack>
    </XStack>
  )
}
