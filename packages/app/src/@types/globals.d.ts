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

type CapturedMedia = {
  type: MediaType
  /** path in device file system where the picture was saved */
  uri: string
  width?: number
  height?: number
  mimeType?: string
  extension?: string
}

type Media = { type: MediaType; uri: string }

type User = {
  id: number
  username: string
  avatar: string
  name?: string
}
