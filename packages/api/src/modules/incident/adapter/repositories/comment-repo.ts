import { WatchedList } from 'src/shared/domain/watched-list'
import { Comment } from 'src/modules/incident/domain/models/comment'
import { IRepository } from 'src/shared/infra/db/repository'

export interface ICommentRepo extends IRepository<Comment> {
  findAllOfIncident(incidentId: string, offset?: number): Promise<Comment[]>
  exists(comment: Comment): Promise<boolean>
  delete(comment: Comment): Promise<void>
  commit(comment: Comment): Promise<Comment>
  commitBatch(comments: WatchedList<Comment>): Promise<void>
}
