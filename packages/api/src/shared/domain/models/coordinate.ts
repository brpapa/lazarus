import { ValueObject } from 'src/shared/domain/value-object'
import { err, ok, Result } from 'src/shared/logic/result/result'
import { DomainError } from 'src/shared/logic/errors'
import { combine } from 'src/shared/logic/result'
import { Guard, Range } from 'src/shared/logic/guard'

export interface CoordinateProps {
  latitude: number
  longitude: number
}

/** lat/lng in decimal degrees */
export class Coordinate extends ValueObject<CoordinateProps> {
  public static LAT_RANGE: Range = [-90, 90]
  public static LNG_RANGE: Range = [-180, 180]

  get latitude() { return this.props.latitude } // prettier-ignore
  get longitude() { return this.props.longitude } // prettier-ignore

  private constructor(props: CoordinateProps) {
    super(props)
  }

  public static create(props: CoordinateProps): Result<Coordinate, DomainError> {
    const result = combine([
      Guard.inRange(props.latitude, this.LAT_RANGE, 'latitude', 'degrees'),
      Guard.inRange(props.longitude, this.LNG_RANGE, 'longitude', 'degrees'),
    ])
    if (result.isErr()) return err(new DomainError(result.error))
    return ok(new Coordinate(props))
  }

  public toString() {
    return `${this.latitude}, ${this.longitude}`
  }
}
