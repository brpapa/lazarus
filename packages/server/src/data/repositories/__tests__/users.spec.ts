import { beforeEach, describe, test, expect } from '@jest/globals'
import debug from 'debug'
import User from '../../../domain/entities/user'
import UsersRepository from '../users'

const log = debug('test:UsersRepository')

beforeEach(() => {
  const usersRepo = new UsersRepository()
  usersRepo.deleteAll()
})

describe('UsersRepository', () => {
  test('Adding one user', () => {
    const usersRepo = new UsersRepository()

    const user = new User('Bruno', 'bruno.papa@hotmail.com', '123')
    usersRepo.addOne(user)

    log(usersRepo.findAll())

    expect(usersRepo.findOneById(user.id)).toBeTruthy()
  })
})
