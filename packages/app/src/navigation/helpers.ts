import type { NavigationProp, ParamListBase } from '@react-navigation/core'

export type NotificationLink = {
  entity: string
  entityId: string
}

export function resolveNotificationLink<T extends NavigationProp<ParamListBase>>(nav: T, link: NotificationLink) {
  switch (link.entity) {
    case 'INCIDENT':
      nav.navigate('IncidentDetail', { incidentId: link.entityId })
      break
    default:
      console.warn(`Link to entity '${link.entity}' is not implemented yet`)
      break
  }
}
