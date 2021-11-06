import { Result, ok, err } from './result'

export function fromThrowable<F extends (...args: readonly any[]) => any, E>(
  fn: F,
  errFn?: (e: unknown) => E,
) {
  return (...args: Parameters<F>): Result<ReturnType<F>, E | unknown> => {
    try {
      const value = fn(args)
      return ok(value)
    } catch (e) {
      return err(errFn ? errFn(e) : e)
    }
  }
}

// Given a list of Results, this extracts all the different `T` types from that list
type ExtractOkTypes<T extends readonly Result<unknown, unknown>[]> = {
  [idx in keyof T]: T[idx] extends Result<infer U, unknown> ? U : never
}

// Given a list of Results, this extracts all the different `E` types from that list
type ExtractErrTypes<T extends readonly Result<unknown, unknown>[]> = {
  [idx in keyof T]: T[idx] extends Result<unknown, infer E> ? E : never
}

export function combine<T extends readonly Result<unknown, unknown>[]>(
  resultList: T,
): Result<ExtractOkTypes<T>, ExtractErrTypes<T>[number]>

/**
 * Short circuits on the first `Err` value find
 */
export function combine(list: any): any {
  return combineResultList(list)
}

function combineResultList<T, E>(results: Result<T, E>[]): Result<T[], E> {
  return results.reduce((acc, result) => {
    if (acc.isOk()) {
      if (result.isErr()) return err(result.error)
      return acc.mapOk(appendValueToEndOfList(result.value))
    }
    return acc
  }, ok([]) as Result<T[], E>)
}

const appendValueToEndOfList =
  <T>(value: T) =>
  (list: T[]): T[] => {
    // need to wrap `value` inside of an array in order to prevent
    // Array.prototype.concat from destructuring the contents of `value`
    // into `list`.
    //
    // Otherwise you will receive [ 'hi', 1, 2, 3 ]
    // when you actually expected a tuple containing [ 'hi', [ 1, 2, 3 ] ]
    if (Array.isArray(value)) {
      return list.concat([value])
    }

    return list.concat(value)
  }

/**
 * Give a list of all the errors we find
 */
const combineResultListWithAllErrors = <T, E>(resultList: Result<T, E>[]): Result<T[], E[]> =>
  resultList.reduce((acc, result) => {
    if (result.isErr()) {
      return acc.isErr() ? err([...acc.error, result.error]) : err([result.error])
    }
    return acc.isErr() ? acc : ok([...acc.value, result.value])
  }, ok([]) as Result<T[], E[]>)

export function combineWithAllErrors<T extends readonly Result<unknown, unknown>[]>(
  resultList: T,
): Result<ExtractOkTypes<T>, ExtractErrTypes<T>[number][]>

export function combineWithAllErrors(list: any): any {
  return combineResultListWithAllErrors(list)
}
