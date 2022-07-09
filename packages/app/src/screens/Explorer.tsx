import { t } from '@lazarus/shared'
import { LinearGradient } from 'expo-linear-gradient'
import React, { Suspense, useRef } from 'react'
import { View } from 'react-native'
import { graphql, useRefetchableFragment } from 'react-relay'
import { useRecoilState } from 'recoil'
import {
  FloatingButton,
  IncidentPreview,
  Loading,
  MapView,
  SegmentedControl,
  Text,
} from '~/components/v1'
import { IncidentMarkerList } from '~/components/v1/organisms/MapView/IncidentMarkerList'
import type { MapViewRef } from '~/components/v1/organisms/MapView/MapView'
import { selectedIncidentIdInMap } from '~/data/recoil'
import { useIncidentsFilterSegmentedControlProps } from '~/hooks/use-incidents-filter-segmented-control'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '~/shared/constants'
import { makeUseStyles, useTheme } from '~/theme/v1'
import type { ExplorerRefreshQuery as ExplorerRefreshQueryType } from '~/__generated__/ExplorerRefreshQuery.graphql'
import type { Explorer_query$key } from '~/__generated__/Explorer_query.graphql'

type ExplorerProps = {
  queryRef: Explorer_query$key
}

// prettier-ignore
const frag = graphql`
  fragment Explorer_query on Query 
    @refetchable(queryName: "ExplorerRefreshQuery") {

    ...IncidentMarkerList_query

    me {
      user {
        preferences {
          radiusDistance
        }
      }
      stats {
        nearbyIncidentsCount
        nearbyUsersCount
      }
    }
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

  const mapViewRef = useRef<MapViewRef | null>(null)
  const [selectedIncidentId, setSelectedIncidentId] = useRecoilState(selectedIncidentIdInMap)
  const filterSegmentedControlProps = useIncidentsFilterSegmentedControlProps()

  const showHighlightStats =
    (data.me?.stats.nearbyIncidentsCount ?? null) !== null &&
    (data.me?.stats.nearbyUsersCount ?? null) !== null

  return (
    <View style={s.container}>
      <MapView ref={mapViewRef} radiusDistance={data?.me?.user?.preferences.radiusDistance}>
        <IncidentMarkerList queryRef={data} />
      </MapView>

      {/* overlayed to MapView views: */}

      {/* // TODO: filter by latest days */}
      {/* <View style={s.topContainer}>
        <SegmentedControl {...filterSegmentedControlProps} />
      </View> */}

      <View style={s.bottomsContainer}>
        <FloatingButton icon={'User'} onPress={() => mapViewRef?.current?.flyToUser()} />
      </View>

      <LinearGradient
        style={s.gradient}
        colors={[colors.fullTransparent, colors.fullBackground]}
        locations={[0, 0.79]}
      />

      {selectedIncidentId === null ? (
        showHighlightStats && (
          <View style={s.highlightStatsContainer}>
            <Text variant="header">
              {
                t('explorer.incidentsNearby', {
                  count: data.me.stats.nearbyIncidentsCount,
                }) as string
              }
            </Text>
            <Text variant="body">
              {
                t('explorer.peopleWithinCircle', {
                  count: data.me.stats.nearbyUsersCount,
                  radiusInMeters: data.me.user.preferences.radiusDistance,
                }) as string
              }
            </Text>
          </View>
        )
      ) : (
        <View style={s.previewContainer}>
          <Suspense fallback={<Loading />}>
            <IncidentPreview
              incidentId={selectedIncidentId}
              closeable={true}
              onClosed={() => setSelectedIncidentId(null)}
            />
          </Suspense>
        </View>
      )}
    </View>
  )
}

const useStyles = makeUseStyles(({ colors, spacing, insets }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT(insets),
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
  highlightStatsContainer: {
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
