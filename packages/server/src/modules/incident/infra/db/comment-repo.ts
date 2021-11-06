import { prisma } from 'src/infra/db/prisma/client'
import { UUID } from 'src/shared/domain/id'
import { WatchedList } from 'src/shared/domain/watched-list'
import { CommentMapper } from '../../adapter/mappers/comment'
import { ICommentRepo } from '../../adapter/repositories/comment'
import { Comment } from '../../domain/models/comment'
import { PrismaRepo } from '../../../../shared/infra/db/prisma-repo'

class CommentRepo extends PrismaRepo<Comment> implements ICommentRepo {
  constructor() {
    super('commentModel')
  }

  findByIncidentId(incidenId: UUID, offset?: number): Promise<Comment[]> {
    throw new Error('Method not implemented.')
  }

  async commit(comment: Comment): Promise<void> {
    const commentModel = CommentMapper.fromDomainToPersistence(comment)

    await prisma.commentModel.upsert({
      where: { id: comment.id.toString() },
      create: commentModel,
      update: commentModel,
    })
  }

  async commitMany(comments: WatchedList<Comment>): Promise<void> {
    const removedItemsPromise = Promise.all(comments.removedItems.map((c) => this.delete(c)))
    const addedItemsPromise = Promise.all(comments.addedItems.map((c) => this.commit(c)))

    await Promise.all([removedItemsPromise, addedItemsPromise])
  }
}

export const commentRepo = new CommentRepo()