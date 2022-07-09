import type { MediaType } from './shared/constants'

export type CapturedMedia = {
  id: string
  type: MediaType
  /** path in device file system where the picture was saved */
  uri: string
  width?: number
  height?: number
  mimeType?: string
  extension?: string
}

export type Media = {
  type: MediaType
  uri: string
}
