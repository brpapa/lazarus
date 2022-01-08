import i18n from 'i18next'
import { LANGUAGE, SUPPORTED_LANGUAGES } from '../config'
import enUS from './../../messages/en-US.json'
import ptBR from './../../messages/pt-BR.json'
import { distanceFormatter, distanceFromSegmentFormatter } from './formatters/distance'
import { relativeTimeToNowFormatter } from './formatters/relative-time'

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

i18n.services.formatter!.add('relativetimetonow', relativeTimeToNowFormatter)
i18n.services.formatter!.add('distanceFromSegment', distanceFromSegmentFormatter)
i18n.services.formatter!.add('distance', distanceFormatter)

export const { t } = i18n
export { i18n }
