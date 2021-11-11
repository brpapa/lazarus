import { Result } from './result'

export interface Query<Req, Res extends Result<any, any>> {
  exec(req: Req): Res | Promise<Res>
}
