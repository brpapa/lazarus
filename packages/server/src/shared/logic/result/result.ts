/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

export type Result<T, E> = Ok<T, E> | Err<T, E>
export const ok = <T, E>(value: T): Ok<T, E> => new Ok(value)
export const err = <T, E>(error: E): Err<T, E> => new Err(error)
export const okVoid = <E>(): Ok<void, E> => new Ok((() => {})())
export const errVoid = <T>(): Err<T, void> => new Err((() => {})())

interface IResult<T, E> {
  isOk(): this is Ok<T, E>
  isErr(): this is Err<T, E>

  /**
   * Maps a `Result<T, E>` to `Result<U, E>` by applying a function to a contained `Ok` value, leaving an `Err` value untouched.
   * @param f The function to apply an `OK` value
   * @returns the result of applying `f` or an `Err` untouched
   */
  mapOk<A>(f: (v: T) => A): Result<A, E>

  /**
   * Maps a `Result<T, E>` to `Result<T, U>` by applying a function to a contained `Err` value, leaving an `Ok` value untouched. This function can be used to pass through a successful result while handling an error.
   * @param f a function to apply to the error `Err` value
   */
  mapErr<U>(f: (e: E) => U): Result<T, U>

  /**
   * Maps a `Result<T, E>` to `Result<A, U>`
   * @param okFn The function to map an `OK` value
   * @param errFn The function to map an `Err` value
   */
  map<A, U>(okFn: (v: T) => A, errFn: (e: E) => U): Result<A, U>

  /**
   * Given 2 functions (one for the `Ok` variant and one for the `Err` variant) execute the function that matches the `Result` variant.
   */
  match<A>(okFn: (v: T) => A, errFn: (e: E) => A): A

  /**
   * Similar to `mapOk` except you must return a new `Result`.
   *
   * This is useful for when you need to do a subsequent computation using the inner `T` value, but that computation might fail. Additionally, `andThen` is really useful as a tool to flatten a `Result<Result<A, E2>, E1>` into a `Result<A, E2>` (see example below).
   * @param f The function to apply to the current value
   */
  andThen<U, F>(f: (v: T) => Result<U, F>): Result<U, E | F>

  /**
   * Takes an `Err` value and maps it to a `Result<T, SomeNewType>`. Useful for error recovery.
   * @param f  A function to apply to an `Err` value, leaving `Ok` values untouched.
   */
  orElse<A>(f: (e: E) => Result<T, A>): Result<T, A>

  /**
   * Return the `Ok` value or a default value if there is an `Err`.
   * @param v the default value
   */
  unwrapOr(v: T): T

  /**
   * For test purposes, returns the `Ok` value or throws an exception
   */
  asOk(): T
}

export class Ok<T, E> implements IResult<T, E> {
  public readonly value: T

  constructor(value: T) {
    this.value = value
  }

  isOk(): this is Ok<T, E> {
    return true
  }
  isErr(): this is Err<T, E> {
    return !this.isOk()
  }
  mapOk<A>(okFn: (v: T) => A): Result<A, E> {
    return ok(okFn(this.value))
  }
  mapErr<U>(errFn: (e: E) => U): Result<T, U> {
    return ok(this.value) // repass the ok result
  }
  map<A, U>(okFn: (v: T) => A, errFn: (e: E) => U): Result<A, U> {
    return ok(okFn(this.value))
  }
  match<A>(okFn: (v: T) => A, errFn: (e: E) => A): A {
    return okFn(this.value)
  }
  andThen<U, F>(okFn: (v: T) => Result<U, F>): Result<U, E | F> {
    return okFn(this.value)
  }
  orElse<A>(errFn: (e: E) => Result<T, A>): Result<T, A> {
    return ok(this.value) // repass the ok result
  }
  unwrapOr(v: T): T {
    return this.value
  }
  asOk(): T {
    return this.value
  }
}

export class Err<T, E> implements IResult<T, E> {
  public readonly error: E

  constructor(error: E) {
    this.error = error
  }

  isOk(): this is Ok<T, E> {
    return false
  }
  isErr(): this is Err<T, E> {
    return !this.isOk()
  }
  mapOk<A>(okFn: (v: T) => A): Result<A, E> {
    return err(this.error) // repass the error result
  }
  mapErr<U>(errFn: (e: E) => U): Result<T, U> {
    return err(errFn(this.error))
  }
  map<A, U>(okFn: (v: T) => A, errFn: (e: E) => U): Result<A, U> {
    return err(errFn(this.error))
  }
  match<A>(okFn: (v: T) => A, errFn: (e: E) => A): A {
    return errFn(this.error)
  }
  andThen<U, F>(okFn: (v: T) => Result<U, F>): Result<U, E | F> {
    return err(this.error) // repass the error result
  }
  orElse<A>(errFn: (e: E) => Result<T, A>): Result<T, A> {
    return errFn(this.error)
  }
  unwrapOr(v: T): T {
    return v
  }
  asOk(): T {
    console.error(this.error)
    throw new Error(`Assertion error, this result it is an error`)
  }
}
