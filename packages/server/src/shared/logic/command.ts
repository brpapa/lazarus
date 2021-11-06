import { Result } from './result'

export interface Command<Req, Res extends Result<void | any, any>> {
  execute(req: Req): Res | Promise<Res>
}
