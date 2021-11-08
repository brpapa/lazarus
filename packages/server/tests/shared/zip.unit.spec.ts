import { expect, describe, it } from '@jest/globals'
import zip from '../../src/shared/logic/helpers/zip'

describe('Helpers', () => {
  it('zip', () => {
    const result = zip([1, 2, 3], ['a', 'b', 'c', 'd'])
    expect(result).toStrictEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
      [undefined, 'd'],
    ])
  })
})
