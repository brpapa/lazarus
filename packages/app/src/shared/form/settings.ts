export type Settings = {
  maxUsernameLength: number
  minUsernameLength: number
  minPasswordLength: number
  fullNameRequired: boolean
}

export const settings: Settings = {
  maxUsernameLength: 32,
  minUsernameLength: 3,
  minPasswordLength: 8,
  fullNameRequired: true,
}
