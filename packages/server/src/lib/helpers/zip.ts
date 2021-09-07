const zip = <A, B>(a: A[], b: B[]): [A | undefined, B | undefined][] =>
  Array(Math.max(b.length, a.length))
    .fill(undefined)
    .map((_, i) => [a[i], b[i]])

export default zip
