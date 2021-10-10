import winston from 'winston'
import consoleFormatter from './formatters/console'

export const getConsoleTransport = (label: string) =>
  new winston.transports.Console({
    format: consoleFormatter({ label }),
  })

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    // MongoDB Transport - https://github.com/winstonjs/winston-mongodb
    // ElasticSearch Transport - https://github.com/vanthome/winston-elasticsearch
    // Logstash formatter - https://github.com/winstonjs/logform/blob/master/logstash.js
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'combined.log' })
    getConsoleTransport('api'),
  ],
})

export default logger
