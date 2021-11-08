import { UserPassword } from '../../src/modules/user/domain/models/user-password'

describe('value object: user password', () => {
  test('should compare passwords correctly', async () => {
    const pw1 = UserPassword.create({ value: '123456789' })
    const pw2 = UserPassword.create({ value: '123456789' })
    const pw3 = UserPassword.create({
      value: (pw2.isOk() && (await pw2.value.getHashedValue())) || '',
      isAlreadyHashed: true,
    })

    expect(pw1.isOk() && pw2.isOk() && pw3.isOk()).toBeTruthy()

    if (pw1.isOk() && pw2.isOk() && pw3.isOk()) {
      expect(pw1.value.compareAgainstPlainText('123456789')).toBeTruthy()
      expect(pw2.value.compareAgainstPlainText('123456789')).toBeTruthy()
      expect(pw3.value.compareAgainstPlainText('123456789')).toBeTruthy()
    }
  })
  test('should not generate new hashes if the instance already generated some hash previously', async () => {
    const pw1 = UserPassword.create({ value: '123456789' })

    expect(pw1.isOk()).toBeTruthy()

    if (pw1.isOk()) {
      expect(pw1.value.isAlreadyHashed).toBeFalsy()
      const hashes = [await pw1.value.getHashedValue(), await pw1.value.getHashedValue()]
      expect(hashes[0]).toEqual(hashes[1])
    }
  })
})
