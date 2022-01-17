import i18n from 'i18next'
import { LANGUAGE, SUPPORTED_LANGUAGES } from '../config'
import enUS from './../../messages/en-US.json'
import ptBR from './../../messages/pt-BR.json'
import { distanceFormatter, distanceFromSegmentFormatter } from './formatters/distance'
import { relativeTimeToNowFormatter } from './formatters/relative-time'

const withExceptionLog = (fn: any) => {
  return (...args: any) => {
    try {
      return fn(...args)
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}

i18n.init({
  lng: LANGUAGE, // not pass this if you are using a language detector
  supportedLngs: SUPPORTED_LANGUAGES,
  debug: false,
  ns: ['translation'],
  defaultNS: 'translation',
  resources: {
    'en-US': { translation: enUS },
    'pt-BR': { translation: ptBR },
  } as const,
  interpolation: {
    escapeValue: true,
    prefix: '{',
    suffix: '}',
  },
  returnNull: false,
  returnEmptyString: false,
  returnObjects: false,
  saveMissing: true,
  missingKeyHandler: (langs: readonly string[], ns: string, key: string) => {
    throw new Error(`Missing key '${key}' on namespace ${ns} of languages: ${langs}`)
  },
})

if (i18n.services.formatter === undefined)
  throw new Error('Formatter is undefined')

// formatter name must be totally lower!
i18n.services.formatter.add('relativetimetonow', withExceptionLog(relativeTimeToNowFormatter))
i18n.services.formatter.add('distancefromsegment', withExceptionLog(distanceFromSegmentFormatter))
i18n.services.formatter.add('distance', withExceptionLog(distanceFormatter))

export const { t } = i18n
export { i18n }

/*
console.log(
  t('incident.distanceToUser', {
    segment: [
      {
        latitude: -22.90536134996816,
        longitude: -48.43612164258957,
      },
      {
        latitude: -22.889,
        longitude: -48.4406,
      },
    ],
  }),
)

console.log(
  t('notifications.nearbyIncidentCreated.body', {
    distInMeters: 1e9,
  }),
)
*/