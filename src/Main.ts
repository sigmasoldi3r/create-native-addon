import 'reflect-metadata'
import Entry from 'ts-entry-point'
import Container from 'typedi'
import Logger, { AbstractLogger, LogLevel } from './services/Logger'

function testLogger(logger: AbstractLogger) {
  logger.trace(
    'Sample log information! ',
    { this: 'is an object' },
    ' A number: ',
    10,
    ' others: ',
    [1, 2, 3]
  )
  logger.debug(
    'Sample log information! ',
    { this: 'is an object' },
    ' A number: ',
    10,
    ' others: ',
    [1, 2, 3]
  )
  logger.info(
    'Sample log information! ',
    { this: 'is an object' },
    ' A number: ',
    10,
    ' others: ',
    [1, 2, 3]
  )
  logger.fine(
    'Sample log information! ',
    { this: 'is an object' },
    ' A number: ',
    10,
    ' others: ',
    [1, 2, 3]
  )
  logger.warn(
    'Sample log information! ',
    { this: 'is an object' },
    ' A number: ',
    10,
    ' others: ',
    [1, 2, 3]
  )
  logger.error(
    'Sample log information! ',
    { this: 'is an object' },
    ' A number: ',
    10,
    ' others: ',
    [1, 2, 3]
  )
  logger.fatal(
    'Sample log information! ',
    { this: 'is an object' },
    ' A number: ',
    10,
    ' others: ',
    [1, 2, 3]
  )
}

@Entry
export default class Main {
  static async main(args: string[]) {
    const logger = Container.get(Logger)
    console.log(`----- FINE ----`)
    testLogger(logger.global)
    console.log(`----- CLASS ----`)
    testLogger(logger.using(Main))
    console.log(`----- ALL ----`)
    logger.level = LogLevel.ALL
    testLogger(logger.global)
    console.log(`----- OFF ----`)
    logger.level = LogLevel.OFF
    testLogger(logger.global)
    console.log(`----- FATAL ----`)
    logger.level = LogLevel.FATAL
    testLogger(logger.global)
    return 0
  }
}
