import { combine } from '@metis/shared'
import { ValueObject } from 'src/modules/shared/domain/value-object'
import { Guard, Range } from 'src/modules/shared/logic/guard'

export interface LocationProps {
  latitude: number
  longitude: number
}

/** lat/lng in decimal degrees */
export class Location extends ValueObject<LocationProps> {
  public static LAT_RANGE: Range = [-85.05112878, 85.05112878] // redis geo set requirement
  public static LNG_RANGE: Range = [-180, 180]

  get latitude() { return this.props.latitude } // prettier-ignore
  get longitude() { return this.props.longitude } // prettier-ignore

  private constructor(props: LocationProps) {
    super(props)
  }

  public static create(props: LocationProps): Location {
    const result = combine([
      Guard.inRange(props.latitude, this.LAT_RANGE, 'latitude', 'degrees'),
      Guard.inRange(props.longitude, this.LNG_RANGE, 'longitude', 'degrees'),
    ])
    if (result.isErr()) throw new Error(result.error as string)
    return new Location(props)
  }

  public toString() {
    return `(${this.latitude}, ${this.longitude})`
  }
}
