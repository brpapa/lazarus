import type { LocationTaskOptions } from 'expo-location'
import * as Location from 'expo-location'

export const FOREGROUND_LOCATION_OPTIONS: Location.LocationOptions = {
  accuracy: Location.Accuracy.High,
  timeInterval: 100,
  distanceInterval: 10,
  mayShowUserSettingsDialog: false,
}

export const BACKGROUND_LOCATION_OPTIONS: LocationTaskOptions = {
  accuracy: Location.Accuracy.Balanced,
  timeInterval: 10_000,
  distanceInterval: 100,
  mayShowUserSettingsDialog: false,
  pausesUpdatesAutomatically: true,
}
