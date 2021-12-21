import { useTheme } from '@shopify/restyle'
import React, { useEffect, useRef, useState } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import GoogleMapView, { LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { UserIcon } from '~/assets/icons'
import Box from '~/components/atomics/Box'
import MyButton from '~/components/MyButton'
import { selectedIncidentIdInMap, userCoordinateState } from '~/data/recoil'
import type { Theme } from '~/shared/theme'
import customMapStyles from './custom-map-styles'

type MapViewProps = {
  style?: StyleProp<ViewStyle>
  /**
   * Components that aren't declared by react-native-maps library (Ex: Markers, Polyline) must not be children of the MapView component due to MapView's unique rendering methodology.
   */
  children: React.ReactNode
}

export default function MapView(props: MapViewProps) {
  // https://github.com/react-native-maps/react-native-maps/blob/master/docs/mapview.md#methods
  const mapRef = useRef<GoogleMapView>(null)
  const theme = useTheme<Theme>()
  const userCoordinate = useRecoilValue(userCoordinateState)

  const [ne, setNe] = useState<LatLng | null>(null)
  const [sw, setSw] = useState<LatLng | null>(null)

  const setSelectedIncidentId = useSetRecoilState(selectedIncidentIdInMap)

  const flyToUserCoordinate = () => {
    mapRef?.current?.animateToRegion({
      ...userCoordinate,
      latitudeDelta: 0.0422,
      longitudeDelta: 0.0221,
    })
  }

  useEffect(flyToUserCoordinate, [userCoordinate])

  return (
    <Box flex={1}>
      <GoogleMapView
        ref={mapRef}
        style={{ alignSelf: 'stretch', height: '100%' }}
        onPress={() => setSelectedIncidentId(null)}
        initialRegion={{
          ...userCoordinate,
          latitudeDelta: 0.1322,
          longitudeDelta: 0.0921,
        }}
        // onRegionChangeComplete={async () => {
        //   const boundary = await mapRef.current?.getMapBoundaries()
        //   if (boundary) {
        //     setNe(boundary.northEast)
        //     setSw(boundary.southWest)
        //   }
        // }}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={false}
        followsUserLocation={false}
        showsMyLocationButton={false}
        showsPointsOfInterest={false}
        showsCompass={false}
        showsBuildings={false}
        showsTraffic={false}
        showsIndoors={false}
        rotateEnabled={false}
        loadingEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        scrollEnabled={true}
        zoomTapEnabled={true}
        customMapStyle={customMapStyles[theme.name]}
      >
        {props.children}
        {userCoordinate && (
          <Marker coordinate={userCoordinate}>
            <Box flex={1} justifyContent={'center'} alignContent={'center'}>
              <Box bg={'success'} borderRadius={8} width={17} height={17} />
            </Box>
          </Marker>
        )}
        {ne && <Marker coordinate={ne} pinColor="blue"></Marker>}
        {sw && <Marker coordinate={sw} pinColor="red"></Marker>}
      </GoogleMapView>
      <Box position={'absolute'} top={70} right={30}>
        <MyButton my={'sm'} icon={UserIcon} onPress={flyToUserCoordinate} />
      </Box>
    </Box>
  )
}

// const fromRegionToBoundary = (region: {
//   latitude: number
//   latitudeDelta: number
//   longitude: number
//   longitudeDelta: number
// }) => {
//   return {
//     northEast: {
//       latitude: region.latitude + region.latitudeDelta / 2,
//       longitude: region.longitude + region.longitudeDelta / 2,
//     },
//     southWest: {
//       latitude: region.latitude - region.latitudeDelta / 2,
//       longitude: region.longitude - region.longitudeDelta / 2,
//     },
//   }
// }
