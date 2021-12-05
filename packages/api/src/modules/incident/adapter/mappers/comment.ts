import { CommentModel } from '@prisma/client'
import { UUID } from 'src/shared/domain/models/uuid'
import { Comment } from '../../domain/models/comment'

export class CommentMapper {
  static fromPersistenceToDomain(model: CommentModel): Comment {
    const comment = Comment.create(
      {
        ownerUserId: new UUID(model.userId),
        incidentId: new UUID(model.incidentId),
        parentCommentId: model.parentCommentId ? new UUID(model.parentCommentId) : undefined,
        content: model.content,
        createdAt: model.createdAt,
      },
      new UUID(model.id),
    ).asOk()
    return comment
  }

  static fromDomainToPersistence(domain: Comment): CommentModel {
    return {
      id: domain.id.toString(),
      content: domain.content,
      userId: domain.ownerUserId.toString(),
      incidentId: domain.incidentId.toString(),
      parentCommentId: domain.parentCommentId?.toString() ?? null,
      createdAt: domain.createdAt,
    }
  }
}
