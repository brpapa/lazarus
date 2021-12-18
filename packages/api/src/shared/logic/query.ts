import { AppContext } from './app-context'
import { Result } from './result'

export interface Query<Req, Res extends Result<any, any>> {
  exec(req: Req, ctx?: AppContext): Res | Promise<Res>
}
