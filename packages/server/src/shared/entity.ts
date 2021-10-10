export default abstract class Entity {
  public readonly id: string
  public createdAt: Date
  // public createdBy: User
  public updatedAt: Date
  // public updatedBy: User

  constructor() {
    this.id = Date.now().toString(16)
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }
}
