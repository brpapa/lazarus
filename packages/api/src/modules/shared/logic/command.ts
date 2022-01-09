import { Debugger } from 'debug'
import { AppContext } from './app-context'
import { Result } from './result'

export abstract class Command<Input, Res extends Result<any, any>> {
  constructor(protected log: Debugger) {}

  async exec(input: Input, ctx: AppContext): Promise<Res> {
    const commandName = Reflect.getPrototypeOf(this)?.constructor.name

    this.log(`Running %o by user %o with the given input: %O`, commandName, ctx?.userId, input)

    try {
      const res = await Promise.resolve(this.execImpl(input, ctx))

      this.log(
        `%o outputs the %o value: %O`,
        commandName,
        res.isOk() ? 'Ok' : 'Err',
        res.isOk() ? res.value : res.error,
      )
      return res
    } catch (e) {
      this.log('Unexpected error occurred at %o: %O', commandName, e)
      throw e
    }
  }

  abstract execImpl(input: Input, ctx: AppContext): Res | Promise<Res>
}
