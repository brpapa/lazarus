import { registerRootComponent } from 'expo'
import 'expo-dev-client'
import { LogBox } from 'react-native'
import 'react-native-gesture-handler'
import { App } from './src/App'

LogBox.ignoreAllLogs() // now show warnings/erros to screen

// It also ensures that whether you load the app in Expo Go or in a native build, the environment is set up appropriately
registerRootComponent(App)
