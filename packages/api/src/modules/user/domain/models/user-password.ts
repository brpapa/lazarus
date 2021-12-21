import bcrypt from 'bcrypt'
import { DomainError } from 'src/shared/logic/errors'
import { Guard } from 'src/shared/logic/guard'
import { Result, err, ok } from 'src/shared/logic/result/result'
import { ValueObject } from 'src/shared/domain/value-object'

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

  static create(props: UserPasswordProps): Result<UserPassword, PasswordSizeError> {
    if (!props.isAlreadyHashed) {
      const lengthOrErr = Guard.againstAtLeast(this.MIN_LENGTH, props.value, 'password')
      if (lengthOrErr.isErr()) return err(new PasswordSizeError(lengthOrErr.error))
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

export class PasswordSizeError extends DomainError {}
