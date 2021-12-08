import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import GoogleMapView, { LatLng, Marker } from 'react-native-maps'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useTheme } from '@tamagui/core'
import { graphql, PreloadedQuery, usePreloadedQuery, useQueryLoader } from 'react-relay'
import customMapStyles from './custom-map-styles'
import mapViewDefaultProps from './default-props'
import { MapPinIcon } from '~/assets/icons'
import { initialRegionState, selectedIncidentIdInMap } from '~/data/recoil'
import { IncidentMarkers } from './IncidentMarkers'
import type { IncidentMarkersQuery } from '~/__generated__/IncidentMarkersQuery.graphql'
import incidentMarkersQuery from '~/__generated__/IncidentMarkersQuery.graphql'
import Loading from '~/components/Loading'
import { XStack } from '~/components/atomics'
import { Button } from '~/components/atomics'
import { DEFAULT_THEME } from '~/shared/config'

type MapViewProps = {
  style?: StyleProp<ViewStyle>
}

export default function MapView(props: MapViewProps) {
  // preloadedQueryRef has value after the loadQuery call
  const [preloadedQueryRef, loadQuery] = useQueryLoader<IncidentMarkersQuery>(incidentMarkersQuery)

  useEffect(() => {
    // fetch the server, then updates the preloadedQueryRef value, then render child component
    loadQuery({
      input: {
        boundary: TEMPORARY_BOUNDARY,
      },
    })
  }, [])

  // https://github.com/react-native-maps/react-native-maps/blob/master/docs/mapview.md#methods
  const mapRef = useRef<GoogleMapView>(null)
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const initialRegion = useRecoilValue(initialRegionState)
  // const [ne, setNe] = useState<LatLng | null>(null)
  // const [sw, setSw] = useState<LatLng | null>(null)

  const [, setSelectedIncidentId] = useRecoilState(selectedIncidentIdInMap)

  function flyToUserLocation() {
    mapRef?.current?.animateToRegion({
      latitude: -22.030108956814786,
      longitude: -47.90166796171124,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    })
  }

  return (
    <XStack flex={1}>
      <GoogleMapView
        {...mapViewDefaultProps}
        ref={mapRef}
        style={{ flex: 1 }}
        customMapStyle={customMapStyles[DEFAULT_THEME]}
        initialRegion={initialRegion}
        onPress={() => setSelectedIncidentId(null)}
        // onRegionChangeComplete={async () => {
        //   const boundary = await mapRef.current?.getMapBoundaries()
        //   console.log(boundary)
        // }}
      >
        {preloadedQueryRef && (
          <Suspense fallback={<Loading />}>
            <IncidentMarkers preloadedQueryRef={preloadedQueryRef} />
          </Suspense>
        )}
        {/* {ne && <Marker coordinate={ne} pinColor="blue"></Marker>} */}
        {/* {sw && <Marker coordinate={sw} pinColor="red"></Marker>} */}
      </GoogleMapView>
      <XStack fullscreen top={insets.top + 10} right={insets.right + 10}>
        <Button size="$1" icon={MapPinIcon} onPress={flyToUserLocation} />
      </XStack>
    </XStack>
  )
}

const fromRegionToBoundary = (region: {
  latitude: number
  latitudeDelta: number
  longitude: number
  longitudeDelta: number
}) => {
  return {
    northEast: {
      latitude: region.latitude + region.latitudeDelta / 2,
      longitude: region.longitude + region.longitudeDelta / 2,
    },
    southWest: {
      latitude: region.latitude - region.latitudeDelta / 2,
      longitude: region.longitude - region.longitudeDelta / 2,
    },
  }
}

const TEMPORARY_BOUNDARY = {
  northEast: {
    latitude: 50,
    longitude: 50,
  },
  southWest: {
    latitude: -50,
    longitude: -50,
  },
}
