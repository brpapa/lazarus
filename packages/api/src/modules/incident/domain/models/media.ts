import { UUID } from 'src/modules/shared/domain/models/uuid'
import { Entity } from 'src/modules/shared/domain/entity'
import { MediaType } from './media-type'

interface MediaProps {
  incidentId: UUID
  url: string
  type: MediaType
  recordedAt: Date
  // recordLocation: Location // TODO
}

/** media metadata */
export class Media extends Entity<MediaProps> {
  public get incidentId() { return this.props.incidentId } // prettier-ignore
  public get url() { return this.props.url } // prettier-ignore
  public get type() { return this.props.type } // prettier-ignore
  public get recordedAt() { return this.props.recordedAt } // prettier-ignore

  private constructor(props: MediaProps, id?: UUID) {
    super(props, id)
  }

  public static create(props: MediaProps, id?: UUID): Media {
    return new Media({ ...props }, id)
  }
}
