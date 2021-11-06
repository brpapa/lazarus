import { UUID } from './id'

interface EntityProps {
  [prop: string]: any
}

export abstract class Entity<T extends EntityProps> {
  public id: UUID
  public props: T

  public constructor(props: T, id?: UUID) {
    this.props = { ...props }
    this.id = id || new UUID()
  }

  public equals(other?: Entity<T>): boolean {
    if (other === null) return false
    if (other === undefined) return false
    if (!(other instanceof Entity)) return false
    if (this === other) return true
    return this.id.equals(other.id)
  }
}
