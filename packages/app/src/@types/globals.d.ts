type ThemeName = 'default' | 'dark'
type Language = 'pt-br' | 'en-us'

type Coordinate = {
  latitude: number
  longitude: number
}

type TimelineUpdate = {
  description: string
  timestamp: string
}

type Incident = {
  id: string
  coordinate: Coordinate
  elapsedTimeSinceLastUpdate: number
  reactionsCount: number
  notificationsAmount: number
  title: string
  timelineUpdates: TimelineUpdate[]
  images: string[]
}

type CapturedMedia = {
  uri: string
}
