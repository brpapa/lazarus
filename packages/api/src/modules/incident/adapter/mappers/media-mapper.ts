import { MediaTypeEnum } from 'src/modules/incident/domain/models/media-type'
import { MediaModel } from '@prisma/client'
import { UUID } from 'src/modules/shared/domain/models/uuid'
import { Media } from '../../domain/models/media'
import { MediaDTO } from '../dtos/media-dto'

export class MediaMapper {
  static fromDomainToDTO(media: Media): MediaDTO {
    return {
      url: media.url,
      type: media.type,
    }
  }

  static fromModelToDomain(model: MediaModel): Media {
    return Media.create(
      {
        url: model.url,
        type: MediaTypeEnum[model.type],
        recordedAt: model.recordedAt,
        incidentId: new UUID(model.incidentId),
      },
      new UUID(model.id),
    )
  }

  static fromDomainToModel(domain: Media): MediaModel {
    return {
      id: domain.id.toString(),
      url: domain.url,
      type: domain.type,
      recordedAt: domain.recordedAt,
      incidentId: domain.incidentId.toString(),
    }
  }
}
