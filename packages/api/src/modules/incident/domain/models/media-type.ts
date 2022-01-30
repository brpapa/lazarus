export const MediaTypeEnum = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
} as const

export type MediaType = typeof MediaTypeEnum[keyof typeof MediaTypeEnum]
