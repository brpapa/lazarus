import { Debugger } from 'debug'
import { AppContext } from './app-context'

export abstract class Query<Input, Res extends any> {
  constructor(protected log: Debugger) {}

  async exec(input: Input, ctx: AppContext): Promise<Res> {
    const commandName = Reflect.getPrototypeOf(this)?.constructor.name

    this.log(`Running %o by user %o with the given input: %O`, commandName, ctx?.userId, input)

    try {
      const res = await Promise.resolve(this.execImpl(input, ctx))
      return res
    } catch (e) {
      this.log('Unexpected error occurred at %o: %O', commandName, e)
      throw e
    }
  }

  abstract execImpl(input: Input, ctx: AppContext): Res | Promise<Res>
}
