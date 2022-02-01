import { IGeocodingService } from 'src/modules/incident/adapter/geocoding-service'
import { LANGUAGE } from '@metis/shared'
import { LocationDTO } from 'src/modules/shared/adapter/dtos/location-dto'
import axios from 'axios'
import { Debugger } from 'debug'
import { GOOGLE_MAPS_GEOCODING_API_KEY, TURN_OFF_GEOCODING_API } from 'src/config'

export class GeocodingService implements IGeocodingService {
  private URL = 'https://maps.googleapis.com/maps/api/geocode/json'

  constructor(private log: Debugger) {}

  // reverse geocoding: input coordinate and outputs human-legible address
  async fetchFormattedAddress(location: LocationDTO): Promise<string | null> {
    if (TURN_OFF_GEOCODING_API) return null

    if (!GOOGLE_MAPS_GEOCODING_API_KEY) {
      this.log('[warn] Google Maps Geocoding API secret not found')
      return null
    }

    const params = {
      latlng: `${location.latitude},${location.longitude}`,
      key: GOOGLE_MAPS_GEOCODING_API_KEY,
      language: this.getLanguage(),
    }

    try {
      const response = await axios.get(this.URL, { params })

      if (response.data?.status !== 'OK') {
        this.log('[warn] Fail return by Geocoding API: %O', {
          status: response.status,
          response: response.data,
          params,
        })
        return null
      }

      const [firstResult] = response.data?.results
      const formattedAddress = firstResult?.formatted_address ?? null
      if (!formattedAddress) {
        this.log('[warn] Undefined return for formattedAddress given location: %o', location)
        return null
      }

      return formattedAddress
    } catch (e: any) {
      this.log('[warn] Fail return by Geocoding API: %o', {
        status: e.response.status,
        response: e.response.data,
      })
      return null
    }
  }

  private getLanguage() {
    switch (LANGUAGE) {
      case 'en-US':
        return 'en'
      case 'pt-BR':
        return 'pt-BR'
      default:
        return 'en'
    }
  }
}
