import { DEFAULT_LANG } from './config'

const buildTranslatedMessages = (lang: Language) =>
  ({
    relativeUpdatedTimeToNow: {
      format: (_params?: { _timestamp?: Date; min?: number }) => {
        return {
          'en-us': 'Updated 56 mins ago',
          'pt-br': `Atualizado há ${_params?.min ?? 2} minutos`,
        }[lang]
      },
    },
    relativeDistanceToCurrentLocation: {
      format: (_params?: { coordinate?: Coordinate; currentLocation?: Coordinate }) =>
        ({
          // "en-us": "2 meters away from you",
          // "pt-br": "Há 2 metros de você"
          'en-us': '2 m',
          'pt-br': '2 m',
        }[lang]),
    },
    amountOfPeopleNotified: {
      format: (params: { amount: number }) =>
        ({
          'en-us': '4.7K people notified',
          'pt-br': `${params?.amount ?? 0} pessoas notificadas`,
        }[lang]),
    },
    // static intl above
    updates: {
      'en-us': 'Updates',
      'pt-br': 'Atualizações',
    }[lang],
    close: {
      'en-us': 'Close',
      'pt-br': 'Fechar',
    }[lang],
    react: {
      'en-us': 'React',
      'pt-br': 'Reagir',
    }[lang],
    comment: {
      'en-us': 'Comment',
      'pt-br': 'Comentar',
    }[lang],
    explorer: {
      'en-us': 'Explore',
      'pt-br': 'Explorar',
    }[lang],
    report: {
      'en-us': 'Report',
      'pt-br': 'Reportar',
    }[lang],
    notifications: {
      'en-us': 'Notifications',
      'pt-br': 'Notificações',
    }[lang],
    profile: {
      'en-us': 'Profile',
      'pt-br': 'Perfil',
    }[lang],
    publishIncident: {
      'en-us': 'Publish incident',
      'pt-br': 'Publicar alerta',
    }[lang],
    myProfile: {
      'en-us': 'My profile',
      'pt-br': 'Meu perfil',
    }[lang],
  } as const)

// type PolygotMessages = typeof polygotMessages
// type MessageKeys = keyof PolygotMessages
// type FormatArgsOf<K extends MessageKeys> = Parameters<PolygotMessages[K]['format']>

const translatedMessages = buildTranslatedMessages(DEFAULT_LANG)
export default translatedMessages
