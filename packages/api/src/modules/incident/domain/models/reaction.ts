import { UUID } from '@shared/domain/models/uuid'
import { Entity } from '@shared/domain/entity'
import { ok, Result } from '@shared/logic/result/result'

type ReactionType = 'pray' | 'angry' | 'uow'

interface ReactionProps {
  type: ReactionType
  incidentId: UUID
  userId: UUID
}

export class Reaction extends Entity<ReactionProps> {
  private constructor(props: ReactionProps, id?: UUID) {
    super(props, id)
  }

  public static create(props: ReactionProps, id?: UUID): Result<Reaction, string> {
    return ok(new Reaction(props, id))
  }
}
