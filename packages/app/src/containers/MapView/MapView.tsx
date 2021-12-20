import { useTheme } from '@shopify/restyle'
import React, { useRef } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import GoogleMapView from 'react-native-maps'
import { useRecoilState, useRecoilValue } from 'recoil'
import Box from '~/components/atomics/Box'
import { initialRegionState, selectedIncidentIdInMap } from '~/data/recoil'
import type { Theme } from '~/shared/theme'
import customMapStyles from './custom-map-styles'
import mapViewDefaultProps from './default-props'

type MapViewProps = {
  style?: StyleProp<ViewStyle>
  children: React.ReactNode
}

export default function MapView(props: MapViewProps) {
  // https://github.com/react-native-maps/react-native-maps/blob/master/docs/mapview.md#methods
  const mapRef = useRef<GoogleMapView>(null)
  const theme = useTheme<Theme>()
  const initialRegion = useRecoilValue(initialRegionState)
  // const [ne, setNe] = useState<LatLng | null>(null)
  // const [sw, setSw] = useState<LatLng | null>(null)

  const [, setSelectedIncidentId] = useRecoilState(selectedIncidentIdInMap)

  return (
    <Box flex={1}>
      <GoogleMapView
        {...mapViewDefaultProps}
        ref={mapRef}
        style={{ flex: 1 }}
        customMapStyle={customMapStyles[theme.name]}
        initialRegion={initialRegion}
        onPress={() => setSelectedIncidentId(null)}
        // onRegionChangeComplete={async () => {
        //   const boundary = await mapRef.current?.getMapBoundaries()
        //   console.log(boundary)
        // }}
      >
        {props.children}
        {/* {ne && <Marker coordinate={ne} pinColor="blue"></Marker>} */}
        {/* {sw && <Marker coordinate={sw} pinColor="red"></Marker>} */}
      </GoogleMapView>
    </Box>
  )
}

// function flyToUserLocation() {
//   mapRef?.current?.animateToRegion({
//     latitude: -22.030108956814786,
//     longitude: -47.90166796171124,
//     latitudeDelta: 0.2,
//     longitudeDelta: 0.2,
//   })
// }

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
