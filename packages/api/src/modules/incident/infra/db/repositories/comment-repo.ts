import { Debugger } from 'debug'
import { PrismaClient } from 'src/api/db/prisma/client'
import { WatchedList } from 'src/modules/shared/domain/watched-list'
import { PrismaRepo } from '../../../../shared/infra/db/prisma-repo'
import { CommentMapper } from '../../../adapter/mappers/comment-mapper'
import { ICommentRepo } from '../../../adapter/repositories/comment-repo'
import { Comment } from '../../../domain/models/comment'

export class CommentRepo extends PrismaRepo<Comment> implements ICommentRepo {
  constructor(private log: Debugger, private prismaClient: PrismaClient) {
    super('commentModel')
  }

  findAllOfIncident(incidentId: string, offset?: number): Promise<Comment[]> {
    throw new Error('Method not implemented.')
  }

  findByIdBatch(ids: string[]): Promise<Comment[]> {
    throw new Error('Method not implemented.')
  }

  async commit(comment: Comment): Promise<Comment> {
    const commentModel = CommentMapper.fromDomainToModel(comment)

    this.log('Persisting a new comment or comment update: %o', comment.id.toString())
    await this.prismaClient.commentModel.upsert({
      where: { id: comment.id.toString() },
      create: commentModel,
      update: commentModel,
    })

    return comment
  }

  async commitBatch(comments: WatchedList<Comment>): Promise<void> {
    const removedItemsPromise = Promise.all(comments.removedItems.map((c) => this.delete(c)))
    const addedItemsPromise = Promise.all(comments.addedItems.map((c) => this.commit(c)))

    await Promise.all([removedItemsPromise, addedItemsPromise])
  }
}
