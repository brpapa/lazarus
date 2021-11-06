import jwt from 'jsonwebtoken'
import { jwtSecretKey } from 'src/shared/config'

export async function getAuthenticatedUser(token?: string) {
  if (!token) return { user: null }

  try {
    const decodedToken = jwt.verify(token.substring(4), jwtSecretKey)
    return null
    // const user = await UserModel.findOne({ _id: (decodedToken as { id: string }).id })
    // return user
  } catch (err) {
    throw new Error('User not authenticated')
  }
}

type UserType = {
  _id: string
}

export function generateToken(user: UserType) {
  return `JWT ${jwt.sign({ id: user._id }, jwtSecretKey)}`
}
