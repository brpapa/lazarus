import { MediaModel } from '@prisma/client'
import { UUID } from 'src/modules/shared/domain/models/uuid'
import { Media } from '../../domain/models/media'
import { MediaType } from '../../domain/models/media-type'
import { MediaDTO } from '../dtos/media-dto'

export class MediaMapper {
  static fromDomainToDTO(media: Media): MediaDTO {
    return {
      url: media.url,
    }
  }
  static fromPersistenceToDomain(model: MediaModel): Media {
    return Media.create(
      {
        url: model.url,
        type: MediaType[model.type],
        recordedAt: model.recordedAt,
        incidentId: new UUID(model.incidentId),
      },
      new UUID(model.id),
    )
  }

  static fromDomainToPersistence(domain: Media): MediaModel {
    return {
      id: domain.id.toString(),
      url: domain.url,
      type: domain.type,
      recordedAt: domain.recordedAt,
      incidentId: domain.incidentId.toString(),
    }
  }
}
