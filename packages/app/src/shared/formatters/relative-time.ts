import { format as baseFormat } from 'timeago.js'

export class RelativeToNowTimeFormatter {
  static format(timestamp: Date, locale: Locales) {
    return baseFormat(timestamp.getTime(), locale.replaceAll('_', '-'))
  }
}
