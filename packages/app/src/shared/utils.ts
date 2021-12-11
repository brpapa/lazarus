export const isDeserializable = (str: string) => {
  try {
    JSON.parse(str)
  } catch {
    return false
  }
  return true
}

export const isSerializable = (value: any) => {
  try {
    JSON.stringify(value)
  } catch {
    return false
  }
  return true
}
