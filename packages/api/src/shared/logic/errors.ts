import debug from 'debug'

const log = debug('app:errors')

export class DomainError {
  constructor(public readonly reason: string) {}
}

export class UseCaseError {
  constructor(public readonly reason: string) {}
}

export class AppError {
  constructor(public readonly reason: string) {}
}

export class UnexpectedError extends AppError {
  constructor(err: any) {
    super('An unexpected error occurred')
  }
}
