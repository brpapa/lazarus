interface ValueObjectProps {
  [prop: string]: any
}

/** A non-identity object, useful to encapsulate validation logic */
export abstract class ValueObject<T extends ValueObjectProps> {
  public props: T

  public constructor(props: T) {
    this.props = { ...props }
  }

  public equals(other?: ValueObject<T>): boolean {
    if (other === null) return false
    if (other === undefined) return false
    if (other.props === undefined) return false
    return JSON.stringify(this.props) === JSON.stringify(other.props)
  }
}
