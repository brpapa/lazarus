import path from 'path'
import fs from 'fs'
import Entity from 'src/shared/entity'

// repo tem que ser burro, sem regra de negocio (sem voltar erros not found, etc, deixar isso a camada service)
export default abstract class FileRepository<T extends Entity> {
  private dbPath
  protected state = new Map<string, T>()

  constructor(collection: string) {
    this.dbPath = path.resolve(__dirname, `./../../db/${collection}.json`)
    try {
      fs.accessSync(this.dbPath, fs.constants.F_OK)
      this.loadState()
    } catch (err) {
      this.persistState()
    }
  }

  protected loadState() {
    const fileData = JSON.parse(fs.readFileSync(this.dbPath, 'utf-8'))
    this.state = Array.isArray(fileData) ? new Map(fileData) : new Map()
  }

  protected persistState() {
    fs.writeFileSync(this.dbPath, JSON.stringify([...this.state.entries()]))
  }
}
