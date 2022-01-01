// TODO: redis, se quiser ter multiplas instancias da aplicacao
export class ActiveClientsRepo {
  // if of users with a established web socket connection
  private activeUsers = new Set<string>()

  add(userId: string) {
    this.activeUsers.add(userId)
  }

  isActive(userId: string) {
    this.activeUsers.has(userId)
  }

  remove(userId: string) {
    this.activeUsers.delete(userId)
  }
}
