import { Debugger } from 'debug'
import { Result } from './result'

export abstract class Command<Req, Res extends Result<void | any, any>> {
  constructor(private readonly log: Debugger) {}

  async exec(req: Req): Promise<Res> {
    const commandName = Reflect.getPrototypeOf(this)?.constructor.name

    this.log(`Running %o with: %O`, commandName, req)

    const res = await Promise.resolve(this.execImpl(req))

    this.log(
      `%o returned an %o value: %O`,
      commandName,
      res.isOk() ? 'Ok' : 'Err',
      res.isOk() ? res.value : res.error,
    )
    return res
  }

  abstract execImpl(req: Req): Res | Promise<Res>
}
