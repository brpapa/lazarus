import React, { useRef, useState } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import GoogleMapView, { LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { selectedIncidentIdInMap, userLocationState } from '~/data/recoil'
import { makeUseStyles, useColorScheme } from '~/theme/v1'
import { FloatingButton } from '../../atoms'
import { customMapStyles } from './custom-map-styles'

type MapViewProps = {
  style?: StyleProp<ViewStyle>
  /**
   * Components that aren't declared by react-native-maps library (Ex: Markers, Polyline) must not be children of the MapView component due to MapView's unique rendering methodology.
   */
  children: React.ReactNode
}

export default function MapView(props: MapViewProps) {
  const s = useStyles()
  const { colorScheme } = useColorScheme()

  // https://github.com/react-native-maps/react-native-maps/blob/master/docs/mapview.md#methods
  const mapRef = useRef<GoogleMapView>(null)
  const userCoordinate = useRecoilValue(userLocationState)

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

  return (
    <View style={s.container}>
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
        customMapStyle={customMapStyles[colorScheme]}
      >
        {props.children}
        {userCoordinate && (
          <Marker coordinate={userCoordinate}>
            <View style={s.userCircleContainer}>
              <View style={s.userCircle} />
            </View>
          </Marker>
        )}
        {ne && <Marker coordinate={ne} pinColor="blue"></Marker>}
        {sw && <Marker coordinate={sw} pinColor="red"></Marker>}
      </GoogleMapView>
      <View style={s.overlayed}>
        <FloatingButton icon={'User'} onPress={flyToUserCoordinate} />
      </View>
    </View>
  )
}

const useStyles = makeUseStyles(({ colors }) => ({
  container: {
    flex: 1,
  },
  userCircleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  userCircle: {
    backgroundColor: colors.success,
    borderRadius: 1000,
    width: 23,
    height: 23,
    borderColor: colors.background,
    borderWidth: 3,
  },
  overlayed: {
    position: 'absolute',
    top: 70,
    right: 30,
  },
}))

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
