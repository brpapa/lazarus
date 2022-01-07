import i18n from 'i18next'
import enUS from './../../messages/en-US.json'
import ptBR from './../../messages/pt-BR.json'
import { LANGUAGE } from '../config'
import { DistanceFormatter } from './formatters/distance'
import { RelativeToNowTimeFormatter as RelativeTimeToNowFormatter } from './formatters/relative-time'
import { Language } from '../types'

const supportedLanguages: string[] = ['pt-BR', 'en-US']

i18n.init({
  lng: LANGUAGE, // not pass this if you are using a language detector
  supportedLngs: supportedLanguages,
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

i18n.services.formatter!.add('relativetimetonow', (date: any, lang?: string) => {
  if (!lang || !supportedLanguages.includes(lang)) throw new Error(`Unexpected language: ${lang}`)
  if (!(date instanceof Date))
    throw new Error(`Value should be an instance of Date, received: ${date.constructor.name}`)

  return RelativeTimeToNowFormatter.format(date, lang as Language)
})

i18n.services.formatter!.add('distance', (segment: any, lang?: string) => {
  if (!lang || !supportedLanguages.includes(lang)) throw new Error(`Unexpected language: ${lang}`)

  if (
    segment.constructor.name !== 'Array' &&
    Object.keys(segment) !== ['latitude', 'longitude'] &&
    !Object.values(segment).every((v) => typeof v === 'number')
  )
    throw new Error(`Invalid value object, received: ${JSON.stringify(segment)}`)

  return DistanceFormatter.formatGivenSegment(segment, lang as Language)
})
const { t } = i18n

export { i18n, t }
