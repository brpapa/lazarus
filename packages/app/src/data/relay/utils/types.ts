export type ErrResult<TErrCodeType> = {
  code: TErrCodeType
  reason: string
  reasonIsTranslated: boolean
}
