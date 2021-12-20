export abstract class AppError {
  constructor(public readonly reason: string) {}
}

export class DomainError extends AppError {}

/** use case error */
export class BusinessError extends AppError {}

export class UnauthenticatedError extends AppError {
  constructor() {
    super('User authentication required')
  }
}
