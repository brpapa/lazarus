import { UUID } from 'src/modules/shared/domain/models/uuid'
import { Entity } from 'src/modules/shared/domain/entity'
import { ok, Result } from 'src/modules/shared/logic/result/result'
import { User } from 'src/modules/user/domain/models/user'

interface ActivityLogProps {
  log: string
  createdAt: Date
}

// exemplos:
// "Alerta reportado em {location_address_street_and_number} por {user}" (sempre existe)
// "{user} alterou a localização para {location_address_street_and_number}"
// "{user} alterou o o título para {title}"
// "{user} contribuiu com uma nova imagem/vídeo"

export class ActivityLog extends Entity<ActivityLogProps> {
  constructor(props: ActivityLogProps, id?: UUID) {
    super(props, id)
  }

  public static create(
    props: ActivityLogProps,
    id?: UUID,
  ): Result<ActivityLog, string> {
    return ok(new ActivityLog(props, id))
  }
}
