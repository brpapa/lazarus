import { UseCaseError } from 'src/shared/logic/errors'

export class PhoneNumberAlreadyExistsError extends UseCaseError {
  constructor(phoneNumber: string) {
    super(`The phone number ${phoneNumber} is already associated to another account`)
  }
}
export class UsernameTakenError extends UseCaseError {
  constructor(username: string) {
    super(`The username ${username} was already taken`)
  }
}
