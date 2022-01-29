import { t } from '@metis/shared'
import { LinearGradient } from 'expo-linear-gradient'
import React, { Suspense, useEffect, useRef } from 'react'
import { View } from 'react-native'
import { graphql, useQueryLoader, useRefetchableFragment } from 'react-relay'
import { useRecoilState } from 'recoil'
import { FloatingButton, Loading, SegmentedControl, Text } from '~/components/v1/atoms'
import { IncidentPreview } from '~/components/v1/organisms/IncidentPreview'
import MapView from '~/components/v1/organisms/MapView'
import { IncidentMarkerList } from '~/components/v1/organisms/MapView/IncidentMarkerList'
import type { MapViewRef } from '~/components/v1/organisms/MapView/MapView'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '~/config'
import { selectedIncidentIdInMap } from '~/data/recoil'
import { useIncidentsFilterSegmentedControlProps } from '~/hooks/use-incidents-filter-segmented-control'
import { makeUseStyles, useTheme } from '~/theme/v1'
import type { ExplorerRefreshQuery as ExplorerRefreshQueryType } from '~/__generated__/ExplorerRefreshQuery.graphql'
import type { Explorer_query$key } from '~/__generated__/Explorer_query.graphql'
import type { IncidentPreviewQuery as IncidentPreviewQueryType } from '~/__generated__/IncidentPreviewQuery.graphql'
import IncidentPreviewQuery from '~/__generated__/IncidentPreviewQuery.graphql'

// TODO
const USER_RADIUS_DISTANCE_IN_METERS = 5000
const NEARBY_INCIDENTS_COUNT = 2
const NEARBY_USERS_COUNT = 1230

type ExplorerProps = {
  queryRef: Explorer_query$key
}

const frag = graphql`
  fragment Explorer_query on Query @refetchable(queryName: "ExplorerRefreshQuery") {
    ...IncidentMarkerList_query
  }
`

export function Explorer(props: ExplorerProps) {
  const s = useStyles()
  const { colors } = useTheme()
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

  const filterSegmentedControlProps = useIncidentsFilterSegmentedControlProps()

  const mapViewRef = useRef<MapViewRef | null>(null)

  return (
    <View style={s.container}>
      <MapView ref={mapViewRef} radiusDistance={USER_RADIUS_DISTANCE_IN_METERS}>
        <IncidentMarkerList queryRef={data} />
      </MapView>

      {/* overlayed to MapView views: */}

      <View style={s.topContainer}>
        <SegmentedControl {...filterSegmentedControlProps} />
      </View>

      <View style={s.bottomsContainer}>
        <FloatingButton icon={'User'} onPress={() => mapViewRef?.current?.flyToUser()} />
      </View>

      <LinearGradient
        style={s.gradient}
        colors={[colors.fullTransparent, colors.fullBackground]}
        locations={[0, 0.79]}
      />

      {!someIncidentIsSelected ? (
        <View style={s.highlightContainer}>
          <Text variant="header">
            {t('explorer.incidentsNearby', { count: NEARBY_INCIDENTS_COUNT }) as string}
          </Text>
          <Text variant="body">
            {
              t('explorer.peopleWithinCircle', {
                count: NEARBY_USERS_COUNT,
                radiusInMeters: USER_RADIUS_DISTANCE_IN_METERS,
              }) as string
            }
          </Text>
        </View>
      ) : (
        incidentPreviewQueryRef && (
          <View style={s.previewContainer}>
            <Suspense fallback={<Loading />}>
              <IncidentPreview
                preloadedQuery={incidentPreviewQueryRef}
                closeable={true}
                onClosed={() => setSelectedIncidentId(null)}
              />
            </Suspense>
          </View>
        )
      )}
    </View>
  )
}

const useStyles = makeUseStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  topContainer: {
    position: 'absolute',
    top: 40,
    width: '100%',
    paddingRight: spacing.l,
    paddingLeft: spacing.l,
  },
  bottomsContainer: {
    position: 'absolute',
    top: 100,
    right: 12,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  previewContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  highlightContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    marginBottom: spacing.m,
    justifyContent: 'center',
    alignItems: 'center',
  },
}))
