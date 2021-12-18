import debug from 'debug'
import { PrismaClient } from 'src/infra/db/prisma/client'
import { WatchedList } from 'src/shared/domain/watched-list'
import { CommentMapper } from '../../../adapter/mappers/comment-mapper'
import { ICommentRepo } from '../../../adapter/repositories/comment-repo'
import { Comment } from '../../../domain/models/comment'
import { PrismaRepo } from '../../../../../shared/infra/db/prisma-repo'

const log = debug('app:incident:infra')

export class CommentRepo extends PrismaRepo<Comment> implements ICommentRepo {
  constructor(private prismaClient: PrismaClient) {
    super('commentModel')
  }

  findByIncidentId(incidenId: string, offset?: number): Promise<Comment[]> {
    throw new Error('Method not implemented.')
  }

  findManyByIds(ids: string[]): Promise<Comment[]> {
    throw new Error('Method not implemented.')
  }

  async commit(comment: Comment): Promise<Comment> {
    try {
      const commentModel = CommentMapper.fromDomainToPersistence(comment)

      log('Persisting a new comment or comment update: %o', comment.id.toString())
      await this.prismaClient.commentModel.upsert({
        where: { id: comment.id.toString() },
        create: commentModel,
        update: commentModel,
      })

      return comment
    } catch (e) {
      log('Unexpected error: %O', e)
      throw e
    }
  }

  async commitMany(comments: WatchedList<Comment>): Promise<void> {
    const removedItemsPromise = Promise.all(comments.removedItems.map((c) => this.delete(c)))
    const addedItemsPromise = Promise.all(comments.addedItems.map((c) => this.commit(c)))

    await Promise.all([removedItemsPromise, addedItemsPromise])
  }
}
