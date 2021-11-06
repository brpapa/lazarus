import { randomUUID } from 'crypto'
import { Identifier } from './identifier'

export class UUID extends Identifier<string> {
  public constructor(id?: string) {
    super(id || randomUUID())
  }
}

export class AggRootId extends UUID {}
