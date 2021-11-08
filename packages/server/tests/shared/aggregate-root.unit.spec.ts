import { expect, describe, it } from '@jest/globals'
import { AggregateRoot } from '../../src/shared/domain/aggregate-root'
import { UUID } from '../../src/shared/domain/models/uuid'

class MyAgg extends AggregateRoot<number> {}

describe('aggregate root', () => {
  it('it should be equals', () => {
    const agg1 = new MyAgg(1, new UUID('1'))
    const agg2 = new MyAgg(2, new UUID('1'))
    expect(agg1.equals(agg2)).toBeTruthy()
  })
  it('it should not be equals', () => {
    const agg1 = new MyAgg(1)
    const agg2 = new MyAgg(2)
    expect(agg1.equals(agg2)).toBeFalsy()
  })
})
