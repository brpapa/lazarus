import { Entity } from './entity'

type ItemStatus = 'current' | 'initial' | 'added' | 'removed'
type Items<T> = Record<ItemStatus, T[]>

export class WatchedList<T extends Entity<any>> {
  private items: Items<T>

  private constructor(initialItems?: T[]) {
    this.items = {
      current: initialItems || [],
      initial: initialItems || [],
      added: [],
      removed: [],
    }
  }

  public static create<T extends Entity<any>>(initialItems?: T[]) {
    return new WatchedList<T>(initialItems)
  }

  get currentItems(): T[] {
    return this.items.current
  }

  get addedItems(): T[] {
    return this.items.added
  }

  get removedItems(): T[] {
    return this.items.removed
  }

  public exists(item: T): boolean {
    return this.in(item, 'current')
  }

  public addBatch(items: T[]): void {
    items.forEach((item) => this.add(item))
  }

  public add(item: T): void {
    if (this.in(item, 'removed')) {
      this.removeFrom(item, 'removed')
    }

    if (!this.in(item, 'added') && !this.in(item, 'initial')) {
      this.items.added.push(item)
    }

    if (!this.in(item, 'current')) {
      this.items.current.push(item)
    }
  }

  public remove(item: T): void {
    this.removeFrom(item, 'current')

    if (this.in(item, 'added')) {
      this.removeFrom(item, 'added')
      return
    }

    if (!this.in(item, 'removed')) {
      this.items.removed.push(item)
    }
  }

  private in(item: T, status: ItemStatus) {
    return this.items[status].filter((v: T) => this.compare(item, v)).length !== 0
  }

  private removeFrom(item: T, status: ItemStatus) {
    this.items[status] = this.items[status].filter((v) => !this.compare(v, item))
  }

  private compare(a: T, b: T) {
    return a.equals(b)
  }
}
