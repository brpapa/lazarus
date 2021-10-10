import Entity from '../../shared/entity'

export default class User extends Entity {
  public static collection = 'users'
  
  public name: string
  public email: string
  public password: string

  constructor(name: string, email: string, password: string) {
    super()
    this.name = name
    this.email = email
    this.password = password
  }
}
