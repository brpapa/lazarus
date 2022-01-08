export const unixEpochToDate = (s: number) => {
  const ms = s * 1_000
  return new Date(ms)
}
