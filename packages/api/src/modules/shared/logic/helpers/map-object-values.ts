export const mapObjectValues = <T, R>(
  obj: Record<string, T>,
  callbackFn: (value: T, key: string, index: number) => R,
) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value], index) => [key, callbackFn(value, key, index)]),
  )
}
