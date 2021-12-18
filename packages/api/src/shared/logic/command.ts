import { Debugger } from 'debug'
import { AppContext } from './app-context'
import { Result } from './result'

export abstract class Command<Input, Output extends Result<any, any>> {
  constructor(private readonly log: Debugger) {}

  async exec(input: Input, ctx?: AppContext): Promise<Output> {
    const commandName = Reflect.getPrototypeOf(this)?.constructor.name

    this.log(`Running %o given input: %O`, commandName, input)

    const res = await Promise.resolve(this.execImpl(input, ctx))

    this.log(
      `%o outputs the %o value: %O`,
      commandName,
      res.isOk() ? 'Ok' : 'Err',
      res.isOk() ? res.value : res.error,
    )
    return res
  }

  abstract execImpl(input: Input, ctx?: AppContext): Output | Promise<Output>
}
