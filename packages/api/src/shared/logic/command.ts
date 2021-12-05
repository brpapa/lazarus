import { Result } from './result'

export interface Command<Req, Res extends Result<void | any, any>> {
  exec(req: Req): Res | Promise<Res>
}
