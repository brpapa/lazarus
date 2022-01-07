type ThemeName = 'default' | 'dark'

type Location = {
  latitude: number
  longitude: number
}

type TimelineUpdate = {
  description: string
  timestamp: string
}

type Incident = {
  id: string
  coordinate: Location
  elapsedTimeSinceLastUpdate: number
  reactionsCount: number
  notificationsAmount: number
  title: string
  timelineUpdates: TimelineUpdate[]
  images: string[]
}

type AccessToken = {
  value: string
  expiresIn: Date
}
