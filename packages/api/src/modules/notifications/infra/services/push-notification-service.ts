import { Debugger } from 'debug'
import Expo from 'expo-server-sdk'
import {
  IPushNotificationService,
  PushTicket,
} from 'src/modules/notifications/adapter/push-notification-service'
import { PushMessage } from '../../domain/models/push-message'

export class PushNotificationService implements IPushNotificationService {
  constructor(private log: Debugger, private expoClient: Expo) {}

  async sendPushNotifications(messages: PushMessage[]): Promise<PushTicket[]> {
    // the Expo push notification service accepts batches of notifications to reduce the number of requests and to compress them (notifications with similar content will get compressed).
    const messagesChunks = this.expoClient.chunkPushNotifications(messages)

    // send one chunk at at time to Expo Push Notification Service, which nicely spreads the load out over time
    const ticketsChunks = await Promise.all(
      messagesChunks.map(async (messages) => {
        try {
          const tickets = await this.expoClient.sendPushNotificationsAsync(messages)
          tickets.forEach((ticket) => {
            if (ticket.status === 'error') {
              // The error codes are listed in the Expo documentation: https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
              this.log('[error] Failed to send message: %o', ticket)
            }
          })

          return tickets
        } catch (error) {
          this.log('[error] Failed to send a chunk of messages: %o', error)
        }
        return []
      }),
    )

    // A push ticket indicates that Expo has received your notification payload but may not have sent it yet. Each push ticket contains a ticket ID, which you later use to look up a push receipt.
    const tickets = ticketsChunks.flat(1)
    return tickets
  }

  isPushToken(pushToken: string) {
    return Expo.isExpoPushToken(pushToken)
  }
}
