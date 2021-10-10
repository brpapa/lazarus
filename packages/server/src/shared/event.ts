export default abstract class Event<T> {
  readonly id: string
  name: string
  data: T
  timestamp: Date

  constructor(name: string, data: T) {
    this.id = Date.now().toString(16)
    this.name = name
    this.data = data
    this.timestamp = new Date()
  }
}
