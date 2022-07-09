export const LanguageEnum = {
  PT_BR: 'pt-BR',
  EN_US: 'en-US',
} as const

export type Language = typeof LanguageEnum[keyof typeof LanguageEnum]
