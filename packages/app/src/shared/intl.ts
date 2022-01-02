import { LOCALE } from '../config'
import { DistanceFormatter } from './formatters/distance'
import { RelativeToNowTimeFormatter } from './formatters/relative-time'

const buildTranslatedMessages = (lang: Locales) =>
  ({
    relativeUpdatedTimeToNow: {
      format: (timestamp: Date) => {
        return {
          'en-US': `Updated ${RelativeToNowTimeFormatter.format(timestamp, 'en-US')}`,
          'pt-BR': `Atualizado ${RelativeToNowTimeFormatter.format(timestamp, 'pt-BR')}`,
        }[lang]
      },
    },
    relativeDistanceToCurrentLocation: {
      format: (params: { point: Location; currentLocation: Location }) => {
        return {
          'en-US': DistanceFormatter.formatGivenPoints(params.point, params.currentLocation),
          'pt-BR': DistanceFormatter.formatGivenPoints(params.point, params.currentLocation),
        }[lang]
      },
    },
    amountOfPeopleNotified: {
      format: (params: { amount: number }) =>
        ({
          'en-US': '4.7K people notified',
          'pt-BR': `${params?.amount ?? 0} pessoas notificadas`,
        }[lang]),
    },
    // static intl above
    updates: {
      'en-US': 'Updates',
      'pt-BR': 'Atualizações',
    }[lang],
    close: {
      'en-US': 'Close',
      'pt-BR': 'Fechar',
    }[lang],
    react: {
      'en-US': 'React',
      'pt-BR': 'Reagir',
    }[lang],
    comment: {
      'en-US': 'Comment',
      'pt-BR': 'Comentar',
    }[lang],
    explorer: {
      'en-US': 'Explore',
      'pt-BR': 'Explorar',
    }[lang],
    report: {
      'en-US': 'Report',
      'pt-BR': 'Reportar',
    }[lang],
    notifications: {
      'en-US': 'Notifications',
      'pt-BR': 'Notificações',
    }[lang],
    profile: {
      'en-US': 'Profile',
      'pt-BR': 'Perfil',
    }[lang],
    publishIncident: {
      'en-US': 'Publish incident',
      'pt-BR': 'Publicar alerta',
    }[lang],
    myProfile: {
      'en-US': 'My profile',
      'pt-BR': 'Meu perfil',
    }[lang],
  } as const)

// type PolygotMessages = typeof polygotMessages
// type MessageKeys = keyof PolygotMessages
// type FormatArgsOf<K extends MessageKeys> = Parameters<PolygotMessages[K]['format']>

const translatedMessages = buildTranslatedMessages(LOCALE)
export default translatedMessages
