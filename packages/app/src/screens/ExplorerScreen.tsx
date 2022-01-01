import React, { Suspense, useEffect } from 'react'
import { useQueryLoader } from 'react-relay'
import { useRecoilState } from 'recoil'
import Box from '~/components/atomics/Box'
import Loading from '~/components/Loading'
import IncidentPreview from '~/containers/IncidentPreview'
import MapView from '~/containers/MapView'
import { IncidentMarkers } from '~/containers/MapView/IncidentMarkers'
import { selectedIncidentIdInMap } from '~/data/recoil'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '~/config'
import type { IncidentMarkersQuery as IncidentMarkersQueryType } from '~/__generated__/IncidentMarkersQuery.graphql'
import IncidentMarkersQuery from '~/__generated__/IncidentMarkersQuery.graphql'
import type { IncidentPreviewQuery as IncidentPreviewQueryType } from '~/__generated__/IncidentPreviewQuery.graphql'
import IncidentPreviewQuery from '~/__generated__/IncidentPreviewQuery.graphql'

export default function ExplorerScreen() {
  const [incidentMarkersQueryRef, loadIncidentMarkersQuery] =
    useQueryLoader<IncidentMarkersQueryType>(IncidentMarkersQuery)
  const [incidentPreviewQueryRef, loadIncidentPreviewQuery] =
    useQueryLoader<IncidentPreviewQueryType>(IncidentPreviewQuery)

  const [selectedIncidentId, setSelectedIncidentId] = useRecoilState(selectedIncidentIdInMap)
  const someIncidentIsSelected = selectedIncidentId !== null

  useEffect(() => {
    // this will need to be refreshed/reloaded here for each map resize later
    loadIncidentMarkersQuery({})
  }, [loadIncidentMarkersQuery])

  useEffect(() => {
    if (selectedIncidentId === null) return
    loadIncidentPreviewQuery({ id: selectedIncidentId })
  }, [loadIncidentPreviewQuery, selectedIncidentId])

  return (
    <Box flex={1} bg="background" width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
      <MapView>
        {incidentMarkersQueryRef && (
          <Suspense fallback={null}>
            <IncidentMarkers preloadedQuery={incidentMarkersQueryRef} />
          </Suspense>
        )}
      </MapView>
      <Box position="absolute" bottom={0} width={'100%'}>
        {someIncidentIsSelected && incidentPreviewQueryRef && (
          <Suspense fallback={<Loading />}>
            <IncidentPreview
              preloadedQuery={incidentPreviewQueryRef}
              closeable={true}
              onClosed={() => setSelectedIncidentId(null)}
            />
          </Suspense>
        )}
      </Box>
    </Box>
  )
}
