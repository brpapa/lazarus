import { registerRootComponent } from 'expo'
import 'expo-dev-client'
import 'react-native-gesture-handler'
import { AppContainer } from './src/AppContainer'

// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(AppContainer)
