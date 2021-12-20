import { MapViewProps, PROVIDER_GOOGLE } from 'react-native-maps'

const mapViewDefaultProps: MapViewProps = {
  provider: PROVIDER_GOOGLE,
  showsUserLocation: true,
  showsPointsOfInterest: false,
  showsCompass: false,
  showsBuildings: false,
  showsTraffic: false,
  showsIndoors: false,
  rotateEnabled: false,
  loadingEnabled: true,
  zoomEnabled: true,
  pitchEnabled: true,
  scrollEnabled: true,
  zoomTapEnabled: true,
  showsMyLocationButton: true, // TODO: criar meu proprio botao
}

export default mapViewDefaultProps
