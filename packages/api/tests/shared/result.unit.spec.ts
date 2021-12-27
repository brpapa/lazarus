import { describe, it, expect } from '@jest/globals'
import { err, ok, Result, combine } from '../../src/modules/shared/logic/result'

describe('result', () => {
  it('andThen', () => {
    const r1 = ok('1-ok').andThen(() => err('1-err'))
    if (r1.isErr()) expect(r1.error).toBe('1-err')

    const r2 = ok('1-ok').andThen(() => ok('2-ok'))
    if (r2.isOk()) expect(r2.value).toBe('2-ok')

    const r3 = err('1-err').andThen(() => err('2-err'))
    if (r3.isErr()) expect(r3.error).toBe('1-err')

    const r4 = err('1-err').andThen(() => ok('1-ok'))
    if (r4.isErr()) expect(r4.error).toBe('1-err')

    expect(r1.isErr()).toBeTruthy()
    expect(r2.isOk()).toBeTruthy()
    expect(r3.isErr()).toBeTruthy()
    expect(r4.isErr()).toBeTruthy()
  })

  it('orElse', () => {
    const r1 = ok('1-ok').orElse(() => err('1-err'))
    if (r1.isOk()) expect(r1.value).toBe('1-ok')

    const r2 = ok('1-ok').orElse(() => ok('2-ok'))
    if (r2.isOk()) expect(r2.value).toBe('1-ok')

    const r3 = err('1-err').orElse(() => err('2-err'))
    if (r3.isErr()) expect(r3.error).toBe('2-err')

    const r4 = err('1-err').orElse(() => ok('1-ok'))
    if (r4.isOk()) expect(r4.value).toBe('1-ok')

    expect(r1.isOk()).toBeTruthy()
    expect(r2.isOk()).toBeTruthy()
    expect(r3.isErr()).toBeTruthy()
    expect(r4.isOk()).toBeTruthy()
  })

  it('combine: at least one error', () => {
    const results: Result<string, string>[] = [ok('1-ok'), err('1-err'), ok('2-ok'), err('2-err')]
    const combinedResults = combine(results)
    expect(combinedResults.isErr()).toBeTruthy()
    if (combinedResults.isErr()) expect(combinedResults.error).toBe('1-err')
  })

  it('combine: no error', () => {
    const results: Result<string, string>[] = [ok('1-ok'), ok('2-ok')]
    const combinedResults = combine(results)
    expect(combinedResults.isOk()).toBeTruthy()
    if (combinedResults.isOk()) expect(combinedResults.value).toEqual(['1-ok', '2-ok'])
  })
})
