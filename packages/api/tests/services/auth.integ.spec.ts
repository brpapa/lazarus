import assert from 'assert'
import { User } from 'src/modules/user/domain/models/user'
import { authService } from 'src/modules/user/application/services'
import { cleanUpDatasources, connectDataSources, disconnectDatasources } from 'tests/helpers'
import { UUID } from 'src/modules/shared/domain/models/uuid'
import { UserPassword } from 'src/modules/user/domain/models/user-password'
import { UserPhoneNumber } from 'src/modules/user/domain/models/user-phone-number'

describe('services: auth', () => {
  beforeAll(connectDataSources)
  afterAll(disconnectDatasources)

  describe('it should (un)authenticate an existing user', () => {
    beforeAll(cleanUpDatasources)
    afterAll(cleanUpDatasources)

    const user = User.create(
      {
        username: 'my-user-name',
        password: UserPassword.create({ value: 'my awesome password' }).asOk(),
        phoneNumber: UserPhoneNumber.create({ value: '14 9999999' }).asOk(),
      },
      new UUID('my-user-id'),
    )

    test('generating the first token', async () => {
      const accessToken = authService.encodeJwt({
        userId: user.id.toString(),
        username: user.username,
      })
      const refreshToken = authService.genRefreshToken()
      user.withTokens(accessToken, refreshToken)
      await authService.authenticateUser(user)
      const tokens = await authService.getActiveTokens('my-user-name')
      expect(tokens.length).toBe(1)
      expect(tokens[0]).toBe(accessToken)
      const username = await authService.getUserNameFromRefreshToken(refreshToken)
      expect(username).toBe(user.username)
    })

    test('overwritting the access token', async () => {
      const newAccessToken = authService.encodeJwt({
        userId: user.id.toString(),
        username: user.username,
      })
      user.withTokens(newAccessToken)
      await authService.authenticateUser(user)
      const newActiveTokens = await authService.getActiveTokens('my-user-name')
      expect(newActiveTokens.length).toBe(1)
      expect(newActiveTokens[0]).toBe(newAccessToken)
    })

    test('clearing all sessions', async () => {
      await authService.unauthenticateUser('my-user-name')
      const tokensNow = await authService.getActiveTokens('my-user-name')
      expect(tokensNow).toEqual([])
      assert(user.refreshToken)
      const usernameNow = await authService.getUserNameFromRefreshToken(user.refreshToken)
      expect(usernameNow).toBe(null)
    })
  })
})
