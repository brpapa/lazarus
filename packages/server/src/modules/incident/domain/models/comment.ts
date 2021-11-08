import { UUID } from 'src/shared/domain/models/uuid'
import { Entity } from 'src/shared/domain/entity'
import { ok, Result } from 'src/shared/logic/result/result'
import { DomainError } from 'src/shared/logic/errors'
import assert from 'assert'

interface CommentProps {
  ownerUserId: UUID
  incidentId: UUID
  parentCommentId?: UUID
  content: string
  createdAt?: Date
}

export class Comment extends Entity<CommentProps> {
  public get ownerUserId() { return this.props.ownerUserId } // prettier-ignore
  public get incidentId() { return this.props.incidentId } // prettier-ignore
  public get parentCommentId() { return this.props.parentCommentId } // prettier-ignore
  public get content() { return this.props.content } // prettier-ignore
  public get createdAt() { assert(this.props.createdAt); return this.props.createdAt } // prettier-ignore

  private constructor(props: CommentProps, id?: UUID) {
    super(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
      },
      id,
    )
  }

  public static create(props: CommentProps, id?: UUID): Result<Comment, DomainError> {
    return ok(new Comment(props, id))
  }

  public isReplyToAnotherComment() {
    return this.parentCommentId !== undefined
  }
}
