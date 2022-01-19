import React, { Suspense, useEffect } from 'react'
import { graphql, useQueryLoader, useRefetchableFragment } from 'react-relay'
import { useRecoilState } from 'recoil'
import Box from '~/components/v0-legacy/atoms/Box'
import { Loading } from '~/components/v1/atoms'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '~/config'
import IncidentPreview from '~/containers/IncidentPreview'
import MapView from '~/containers/MapView'
import { IncidentMarkerList } from '~/containers/MapView/IncidentMarkerList'
import { selectedIncidentIdInMap } from '~/data/recoil'
import type { ExplorerRefreshQuery as ExplorerRefreshQueryType } from '~/__generated__/ExplorerRefreshQuery.graphql'
import type { Explorer_query$key } from '~/__generated__/Explorer_query.graphql'
import type { IncidentPreviewQuery as IncidentPreviewQueryType } from '~/__generated__/IncidentPreviewQuery.graphql'
import IncidentPreviewQuery from '~/__generated__/IncidentPreviewQuery.graphql'

type ExplorerProps = {
  queryRef: Explorer_query$key
}

const frag = graphql`
  fragment Explorer_query on Query @refetchable(queryName: "ExplorerRefreshQuery") {
    ...IncidentMarkerList_query
  }
`

export function Explorer(props: ExplorerProps) {
  // later the incidents will be refetched for each map resize later (move this down to re-render IncidentMarkerList only)
  const [data, _refetch] = useRefetchableFragment<ExplorerRefreshQueryType, Explorer_query$key>(
    frag,
    props.queryRef,
  )

  const [selectedIncidentId, setSelectedIncidentId] = useRecoilState(selectedIncidentIdInMap)
  const someIncidentIsSelected = selectedIncidentId !== null

  const [incidentPreviewQueryRef, loadIncidentPreviewQuery] =
    useQueryLoader<IncidentPreviewQueryType>(IncidentPreviewQuery)

  useEffect(() => {
    if (selectedIncidentId === null) return
    loadIncidentPreviewQuery({ id: selectedIncidentId })
  }, [loadIncidentPreviewQuery, selectedIncidentId])

  return (
    <Box flex={1} bg="background" width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
      <MapView>
        <IncidentMarkerList queryRef={data} />
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
