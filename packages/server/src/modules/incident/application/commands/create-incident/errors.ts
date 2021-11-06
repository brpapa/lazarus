import { UseCaseError } from 'src/shared/logic/errors'

export class PhoneNumberAlreadyExistsError extends UseCaseError {
  constructor(phoneNumber: string) {
    super(`The phone number ${phoneNumber} is already associated to another account`)
  }
}

export class MediaRequiredError extends UseCaseError {
  constructor() {
    super(`At least 1 media uploaded is required`)
  }
}

export class MediaExceededError extends UseCaseError {
  constructor() {
    super(`At least 1 media uploaded is required`)
  }
}
