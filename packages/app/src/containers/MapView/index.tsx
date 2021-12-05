import React from 'react'
import { Text, View } from 'react-native'
import { ENABLE_GOOGLE_MAPS } from '~/shared/config'

import type { default as MapViewComponent } from './MapView'
type MapViewType = typeof MapViewComponent

const createMapView: () => MapViewType = ENABLE_GOOGLE_MAPS
  ? () => {
      const MapView = require('./MapView').default as MapViewType
      return MapView
    }
  : () => {
      return (_props) => (
        <View
          style={{
            flex: 1,
            backgroundColor: 'lightblue',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text>🗺 Map is not available :/</Text>
        </View>
      )
    }

const MapView = createMapView()
export default MapView
