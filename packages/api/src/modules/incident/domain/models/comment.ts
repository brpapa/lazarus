import { UUID } from 'src/modules/shared/domain/models/uuid'
import { Entity } from 'src/modules/shared/domain/entity'
import { ok, Result } from 'src/modules/shared/logic/result/result'
import { DomainError } from 'src/modules/shared/logic/errors'
import assert from 'assert'

interface CommentProps {
  ownerUserId: UUID
  incidentId: UUID
  parentCommentId?: UUID
  content: string
  createdAt?: Date
}

export class Comment extends Entity<CommentProps> {
  get ownerUserId() { return this.props.ownerUserId } // prettier-ignore
  get incidentId() { return this.props.incidentId } // prettier-ignore
  get parentCommentId() { return this.props.parentCommentId } // prettier-ignore
  get content() { return this.props.content } // prettier-ignore
  get createdAt() { assert(this.props.createdAt); return this.props.createdAt } // prettier-ignore

  private constructor(props: CommentProps, id?: UUID) {
    super(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
      },
      id,
    )
  }

  static create(props: CommentProps, id?: UUID): Result<Comment, DomainError> {
    return ok(new Comment(props, id))
  }

  isReplyToAnotherComment() {
    return this.parentCommentId !== undefined
  }
}
