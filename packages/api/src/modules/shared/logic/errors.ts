import { t } from '@metis/shared'

/** the name of leaft class is the error code and also the key for i18n messages */
export abstract class BaseError {
  /** translated error message that will be displayed to the app user */
  public reason: string
  public code: string

  constructor(errorReasonParams?: any) {
    const errorCode = this.getLeafClassName()
    this.reason = t(`errors.${errorCode}`, errorReasonParams)
    this.code = errorCode
  }

  private getLeafClassName() {
    const name = Reflect.getPrototypeOf(this)?.constructor.name
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return name!
  }
}

export abstract class DomainError extends BaseError {}
/** use case error, business error */
export abstract class ApplicationError extends BaseError {}

export class UnauthenticatedError extends ApplicationError {}
export class UserNotFoundError extends ApplicationError {}
