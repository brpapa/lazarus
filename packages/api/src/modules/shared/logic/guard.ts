import { Result, err, okVoid } from '@lazarus/shared'

export type Range = [min: number, max: number]

export class Guard {
  public static againstNullOrUndefined(argument: any, argumentName: string): Result<void, string> {
    if (argument === null || argument === undefined) {
      return err(`${argumentName} is null or undefined`)
    }
    return okVoid()
  }

  public static againstAtLeast(
    minChars: number,
    argument: string,
    argumentName: string,
  ): Result<void, string> {
    if (argument.length < minChars) return err(`${argumentName} has not at least ${minChars} chars`)
    return okVoid()
  }

  public static inRange(
    num: number,
    range: Range,
    argumentName: string,
    unit?: string,
  ): Result<void, string> {
    if (num < range[0] || num > range[1]) {
      const errMessage = `${argumentName} is not between ${range[0]} and ${range[1]}`
      const errMessageWithUnit = [errMessage, unit].filter((v) => !!v).join(' ')
      return err(errMessageWithUnit)
    }
    return okVoid()
  }
}
