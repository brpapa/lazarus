type Keyable = number | string | symbol

export function groupBy<K extends Keyable, V extends Keyable, T extends Record<K, V>>(
  arr: T[],
  key: K,
): Record<T[K], T[]> {
  return arr.reduce((acc, value) => {
    acc[value[key]] = acc[value[key]] || []
    acc[value[key]].push(value)
    return acc
  }, Object.create(null))
}
