import { Result, err, okVoid } from './result'

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
    range: [min: number, max: number],
    argumentName: string,
  ): Result<void, string> {
    if (num < range[0] || num > range[1])
      return err(`${argumentName} is not between ${range[0]} and ${range[1]}`)
    return okVoid()
  }
}
