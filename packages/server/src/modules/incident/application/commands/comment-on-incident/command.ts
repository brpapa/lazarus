import { Result, err, okVoid } from 'src/shared/logic/result/result'
import { Command } from 'src/shared/logic/command'
import { IIncidentRepo } from 'src/modules/incident/adapter/repositories/incident'
import { DomainError, UnexpectedError } from 'src/shared/logic/errors'

export type Request = {
  userId: string
  incidentId: string
  comment: string
}
export type Response = Result<void, DomainError | UnexpectedError>

export class CommentOnIncidentCommand implements Command<Request, Response> {
  constructor(private incidentRepo: IIncidentRepo) {}

  async execute(req: Request): Promise<Response> {}
}
