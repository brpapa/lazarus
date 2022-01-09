import path from 'path'
import fs from 'fs'
import { Entity } from '@shared/domain/entity'
import { IRepository } from './repository'

export abstract class FileRepository<T extends Entity<any>> implements IRepository<T> {
  private dbPath: string
  protected state = new Map<string, T>()

  constructor(collection: string) {
    this.dbPath = path.resolve(`/Users/papa/dev/metis/packages/server/_db/${collection}.json`)
    try {
      fs.accessSync(this.dbPath, fs.constants.F_OK)
      this.loadState()
    } catch (err) {
      this.persistState()
    }
  }

  exists(e: T) {
    return this.state.has(e.id.toString())
  }
  commit(e: T) {
    this.state.set(e.id.toString(), e)
    this.persistState()
    return e
  }
  delete(e: T) {
    this.state.delete(e.id.toString())
    this.persistState()
  }

  protected loadState() {
    const fileData = JSON.parse(fs.readFileSync(this.dbPath, 'utf-8'))
    this.state = Array.isArray(fileData) ? new Map(fileData) : new Map()
  }

  protected persistState() {
    fs.writeFileSync(this.dbPath, JSON.stringify([...this.state.entries()]))
  }
}
