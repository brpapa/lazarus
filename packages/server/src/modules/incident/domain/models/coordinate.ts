import { ValueObject } from 'src/shared/domain/value-object'
import { ok, Result } from 'src/shared/logic/result/result'
import { DomainError } from 'src/shared/logic/errors'

interface CoordinateProps {
  latitude: number
  longitude: number
}

export class Coordinate extends ValueObject<CoordinateProps> {
  get latitude() { return this.props.latitude } // prettier-ignore
  get longitude() { return this.props.longitude } // prettier-ignore

  private constructor(props: CoordinateProps) {
    super(props)
  }

  public static create(props: CoordinateProps): Result<Coordinate, DomainError> {
    return ok(new Coordinate(props))
  }
}
