import { registerRootComponent } from 'expo'
import 'expo-dev-client'
import 'react-native-gesture-handler'
import { App } from './src/App'

// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App)
