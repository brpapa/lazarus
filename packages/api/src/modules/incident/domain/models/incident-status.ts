export const IncidentStatusEnum = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
} as const

export type IncidentStatus = typeof IncidentStatusEnum[keyof typeof IncidentStatusEnum]
