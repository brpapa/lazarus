import bcrypt from 'bcrypt'
import { ValueObject } from 'src/modules/shared/domain/value-object'
import { DomainError } from 'src/modules/shared/logic/errors'
import { err, ok, Result } from '@metis/shared'

interface UserPasswordProps {
  value: string
  isAlreadyHashed?: boolean
}

export class UserPassword extends ValueObject<UserPasswordProps> {
  private generatedHashes: string[]
  static MIN_LENGTH = 8

  get value() { return this.props.value } // prettier-ignore
  get isAlreadyHashed() { return !!this.props.isAlreadyHashed } // prettier-ignore

  private constructor(props: UserPasswordProps) {
    super(props)
    this.generatedHashes = []
  }

  static create(props: UserPasswordProps): Result<UserPassword, ShortPasswordError> {
    if (!props.isAlreadyHashed) {
      if (props.value.length < this.MIN_LENGTH)
        return err(new ShortPasswordError({ min: this.MIN_LENGTH }))
    }

    return ok(new UserPassword({ ...props }))
  }

  async getHashedValue() {
    if (this.isAlreadyHashed) return this.value
    if (this.generatedHashes.length > 0) return this.generatedHashes[0]

    const generatedHash = await UserPassword.generateHash(this.value)
    this.generatedHashes.push(generatedHash)
    return generatedHash
  }

  async compareAgainstPlainText(plainTextPassword: string) {
    if (this.isAlreadyHashed) return UserPassword.compare(plainTextPassword, this.value)
    return this.value === plainTextPassword
  }

  // 1 plainText <-> n hashedText
  private static generateHash(plainText: string): Promise<string> {
    const saltRounds = 10
    return new Promise((res, rej) => {
      bcrypt.hash(plainText, saltRounds, (error, hashed) => (error ? rej(err) : res(hashed)))
    })
  }

  private static compare(plainText: string, hashedText: string): Promise<boolean> {
    return new Promise((res) => {
      bcrypt.compare(plainText, hashedText, (error, same) => (error ? res(false) : res(same)))
    })
  }
}

export class ShortPasswordError extends DomainError {}
