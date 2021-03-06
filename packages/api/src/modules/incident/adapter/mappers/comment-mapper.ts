import { CommentModel } from '@prisma/client'
import { UUID } from 'src/modules/shared/domain/models/uuid'
import { Comment } from 'src/modules/incident/domain/models/comment'

export class CommentMapper {
  static fromModelToDomain(model: CommentModel): Comment {
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

  static fromDomainToModel(domain: Comment): CommentModel {
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
