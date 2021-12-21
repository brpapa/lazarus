export abstract class AppError {
  /** error message visible to the end user */
  public reason: string
  public code: string

  constructor(reason: string) {
    this.reason = reason
    this.code = this.getLeafClassName()
  }

  private getLeafClassName() {
    const name = Reflect.getPrototypeOf(this)?.constructor.name
    if (!name) throw new Error('Unreachable')
    return name
  }
}

export class DomainError extends AppError {}

/** use case error, business error */
export class ApplicationError extends AppError {}

export class UnauthenticatedError extends AppError {
  constructor() {
    super('User authentication required')
  }
}
