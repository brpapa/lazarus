export class Identifier<T> {
  public constructor(private value: T) {}

  public equals(other?: Identifier<T>): boolean {
    if (other === null) return false
    if (other === undefined) return false
    if (!(other instanceof Identifier)) return false
    return this.value === other.getValue()
  }

  public getValue() {
    return this.value
  }

  public toString() {
    return String(this.value)
  }
}
