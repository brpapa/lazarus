import { t } from '@metis/shared'

/** the name of leaft class is the error code and also the key to search for i18n messages */
export abstract class BaseError {
  public code: string
  /** if reasonIsTranslated is true, is the translated error message that can be displayed to the app user */
  public reason: string
  /** reason can be displayed to user app safely? */
  public reasonIsTranslated: boolean

  constructor(displayableToUserReasonParams?: any, notTranslatedReason?: string) {
    const errorCode = this.getLeafClassName()
    this.code = errorCode

    if (notTranslatedReason !== undefined) {
      this.reason = notTranslatedReason
      this.reasonIsTranslated = false
    } else {
      this.reason = t(`errors.${errorCode}`, displayableToUserReasonParams)
      this.reasonIsTranslated = true
    }
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
