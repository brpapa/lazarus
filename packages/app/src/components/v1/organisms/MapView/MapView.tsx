import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import BaseMap, { Circle, LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { selectedIncidentIdInMap, userLocationState } from '~/data/recoil'
import { makeUseStyles, useColorScheme } from '~/theme/v1'
import {
  INITIAL_ZOOM_LEVEL,
  USER_CENTERED_ZOOM_LEVEL,
  ZOOM_LEVEL_1,
  ZOOM_LEVEL_2,
} from './constants'
import { customMapStyles } from './custom-map-styles'

export interface MapViewRef {
  flyToUser: () => void
}

type Props = {
  /** in meters */
  radiusDistance: number
  /** Components that aren't declared by react-native-maps library (Ex: Markers, Polyline) must not be children of the MapView component due to MapView's unique rendering methodology */
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

export const MapView = forwardRef<MapViewRef, Props>((props, ref) => {
  const s = useStyles()
  const { colorScheme } = useColorScheme()

  // https://github.com/react-native-maps/react-native-maps/blob/master/docs/mapview.md#methods
  const baseMapRef = useRef<BaseMap | null>(null)
  const userCoordinate = useRecoilValue(userLocationState)

  const setSelectedIncidentId = useSetRecoilState(selectedIncidentIdInMap)

  // customize the exposed ref
  useImperativeHandle(ref, () => ({
    flyToUser: () => {
      baseMapRef?.current?.animateToRegion({ ...userCoordinate, ...USER_CENTERED_ZOOM_LEVEL })
    },
  }))

  const [ne, setNe] = useState<LatLng | null>(null)
  const [sw, setSw] = useState<LatLng | null>(null)

  return (
    <View style={s.container}>
      <BaseMap
        ref={baseMapRef}
        style={{ alignSelf: 'stretch', height: '100%' }}
        onPress={() => setSelectedIncidentId(null)}
        initialRegion={{ ...userCoordinate, ...INITIAL_ZOOM_LEVEL }}
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
          <>
            <Marker
              coordinate={userCoordinate}
              anchor={{ x: 0.5, y: 0.5 }}
              centerOffset={{ x: 0, y: 0 }}
            >
              <View style={s.userCircle} />
            </Marker>
            <Circle
              center={userCoordinate}
              radius={props.radiusDistance}
              fillColor="#rgba(200,200,200,0.42)"
              strokeColor="#DDD"
              strokeWidth={4}
            />
          </>
        )}
        {ne && <Marker coordinate={ne} pinColor="blue"></Marker>}
        {sw && <Marker coordinate={sw} pinColor="red"></Marker>}
      </BaseMap>
    </View>
  )
})

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
