import debug from 'debug'
import { GeocodingService } from './geocoding-service'

const log = debug('app:incident:infra')

export const geocodingService = new GeocodingService(log)
