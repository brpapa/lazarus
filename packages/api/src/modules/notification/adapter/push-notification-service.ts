import { ExpoPushTicket } from 'expo-server-sdk'
import { PushMessage } from '../domain/models/push-message'

export type PushTicket = ExpoPushTicket

export interface IPushNotificationService {
  sendPushNotifications(messages: PushMessage[]): Promise<PushTicket[]>
  isPushToken(pushToken: string): boolean
}
