import { ExpoPushTicket, ExpoPushMessage } from 'expo-server-sdk'

export type PushMessage = ExpoPushMessage
export type PushTicket = ExpoPushTicket

export interface IPushNotificationService {
  sendPushNotifications(messages: PushMessage[]): Promise<PushTicket[]>
  isPushToken(pushToken: string): boolean
}
