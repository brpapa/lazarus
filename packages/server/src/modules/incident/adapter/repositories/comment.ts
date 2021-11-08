import { WatchedList } from 'src/shared/domain/watched-list'
import { Comment } from 'src/modules/incident/domain/models/comment'
import { IRepository } from '../../../../shared/infra/db/repository'

export interface ICommentRepo extends IRepository<Comment> {
  findByIncidentId(incidenId: string, offset?: number): Promise<Comment[]>
  commitMany(comments: WatchedList<Comment>): Promise<void>
}
