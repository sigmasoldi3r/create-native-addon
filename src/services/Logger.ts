import chalk from 'chalk'
import { Writable } from 'stream'
import { Service } from 'typedi'
import { inspect } from 'util'
import { some } from '../infrastructure/Option'

/**
 * Designates log levels.
 */
export enum LogLevel {
  ALL,
  TRACE,
  DEBUG,
  INFO,
  FINE,
  WARN,
  ERROR,
  FATAL,
  OFF,
}

export interface AbstractLogger {
  trace<T extends any[]>(...args: T): this
  debug<T extends any[]>(...args: T): this
  info<T extends any[]>(...args: T): this
  fine<T extends any[]>(...args: T): this
  warn<T extends any[]>(...args: T): this
  error<T extends any[]>(...args: T): this
  fatal<T extends any[]>(...args: T): this
}

/**
 * Provides a simple standard output logging method, which
 * also can be configured programmatically to output data
 * to other sources.
 */
@Service()
export default class Logger {
  /**
   * Designated sinks for each level, new output streams can
   * be added or removed at will.
   */
  readonly output = {
    trace: [process.stdout] as Writable[],
    debug: [process.stdout] as Writable[],
    info: [process.stdout] as Writable[],
    fine: [process.stdout] as Writable[],
    warn: [process.stdout] as Writable[],
    error: [process.stdout] as Writable[],
    fatal: [process.stdout] as Writable[],
  }

  readonly levelColors = {
    trace: 'gray',
    debug: 'blue',
    info: 'cyan',
    fine: 'green',
    warn: 'yellow',
    error: 'red',
    fatal: 'bgRed',
  }

  dateColor = 'gray'
  lineEnd = '\n'

  /**
   * Date formatter, if not present, date logging is skipped
   * entirely.
   */
  dateFormatter = some((date: Date) => date.toLocaleString())

  /**
   * Logger's current level.
   */
  level = LogLevel.FINE

  /**
   * Creates a bound local logger which can be used per
   * class in order to have a finer source of information.
   */
  using(classObject: { new (): any } | string) {
    if (typeof classObject === 'string') {
      return new LocalLogger(this, classObject)
    }
    return new LocalLogger(this, classObject.name)
  }

  /**
   * Default global logger.
   */
  readonly global = new LocalLogger(this, 'global')
}

/**
 * A local logger that might be used only during a function,
 * or attached to a class and log the during entire class
 * lifetime.
 */
export class LocalLogger implements AbstractLogger {
  constructor(private readonly logger: Logger, readonly source: string) {}
  trace<T extends any[]>(...args: T): this {
    if (this.logger.level > LogLevel.TRACE) {
      return // Disable logging if the level is below!
    }
    if (this.logger.dateFormatter.isPresent()) {
      this.logger.output.trace.forEach(sink =>
        sink.write(
          chalk`[{${this.logger.dateColor} ${this.logger.dateFormatter.get()(
            new Date()
          )}}]`
        )
      )
    }
    this.logger.output.trace.forEach(sink => sink.write(`[${this.source}]`))
    this.logger.output.trace.forEach(sink =>
      sink.write(chalk`[{${this.logger.levelColors.trace} trace}]: `)
    )
    this.logger.output.trace.forEach(sink =>
      args.forEach(arg => {
        if (typeof arg === 'string') {
          sink.write(arg)
        } else {
          sink.write(inspect(arg, false, 2, true))
        }
      })
    )
    this.logger.output.trace.forEach(sink => sink.write(this.logger.lineEnd))
    return this
  }
  debug<T extends any[]>(...args: T): this {
    if (this.logger.level > LogLevel.DEBUG) {
      return // Disable logging if the level is below!
    }
    if (this.logger.dateFormatter.isPresent()) {
      this.logger.output.debug.forEach(sink =>
        sink.write(
          chalk`[{${this.logger.dateColor} ${this.logger.dateFormatter.get()(
            new Date()
          )}}]`
        )
      )
    }
    this.logger.output.debug.forEach(sink => sink.write(`[${this.source}]`))
    this.logger.output.debug.forEach(sink =>
      sink.write(chalk`[{${this.logger.levelColors.debug} debug}]: `)
    )
    this.logger.output.debug.forEach(sink =>
      args.forEach(arg => {
        if (typeof arg === 'string') {
          sink.write(arg)
        } else {
          sink.write(inspect(arg, false, 2, true))
        }
      })
    )
    this.logger.output.debug.forEach(sink => sink.write(this.logger.lineEnd))
    return this
  }
  info<T extends any[]>(...args: T): this {
    if (this.logger.level > LogLevel.INFO) {
      return // Disable logging if the level is below!
    }
    if (this.logger.dateFormatter.isPresent()) {
      this.logger.output.info.forEach(sink =>
        sink.write(
          chalk`[{${this.logger.dateColor} ${this.logger.dateFormatter.get()(
            new Date()
          )}}]`
        )
      )
    }
    this.logger.output.info.forEach(sink => sink.write(`[${this.source}]`))
    this.logger.output.info.forEach(sink =>
      sink.write(chalk`[{${this.logger.levelColors.info} info}]: `)
    )
    this.logger.output.info.forEach(sink =>
      args.forEach(arg => {
        if (typeof arg === 'string') {
          sink.write(arg)
        } else {
          sink.write(inspect(arg, false, 2, true))
        }
      })
    )
    this.logger.output.info.forEach(sink => sink.write(this.logger.lineEnd))
    return this
  }
  fine<T extends any[]>(...args: T): this {
    if (this.logger.level > LogLevel.FINE) {
      return // Disable logging if the level is below!
    }
    if (this.logger.dateFormatter.isPresent()) {
      this.logger.output.fine.forEach(sink =>
        sink.write(
          chalk`[{${this.logger.dateColor} ${this.logger.dateFormatter.get()(
            new Date()
          )}}]`
        )
      )
    }
    this.logger.output.fine.forEach(sink => sink.write(`[${this.source}]`))
    this.logger.output.fine.forEach(sink =>
      sink.write(chalk`[{${this.logger.levelColors.fine} fine}]: `)
    )
    this.logger.output.fine.forEach(sink =>
      args.forEach(arg => {
        if (typeof arg === 'string') {
          sink.write(arg)
        } else {
          sink.write(inspect(arg, false, 2, true))
        }
      })
    )
    this.logger.output.fine.forEach(sink => sink.write(this.logger.lineEnd))
    return this
  }
  warn<T extends any[]>(...args: T): this {
    if (this.logger.level > LogLevel.WARN) {
      return // Disable logging if the level is below!
    }
    if (this.logger.dateFormatter.isPresent()) {
      this.logger.output.warn.forEach(sink =>
        sink.write(
          chalk`[{${this.logger.dateColor} ${this.logger.dateFormatter.get()(
            new Date()
          )}}]`
        )
      )
    }
    this.logger.output.warn.forEach(sink => sink.write(`[${this.source}]`))
    this.logger.output.warn.forEach(sink =>
      sink.write(chalk`[{${this.logger.levelColors.warn} warn}]: `)
    )
    this.logger.output.warn.forEach(sink =>
      args.forEach(arg => {
        if (typeof arg === 'string') {
          sink.write(arg)
        } else {
          sink.write(inspect(arg, false, 2, true))
        }
      })
    )
    this.logger.output.warn.forEach(sink => sink.write(this.logger.lineEnd))
    return this
  }
  error<T extends any[]>(...args: T): this {
    if (this.logger.level > LogLevel.ERROR) {
      return // Disable logging if the level is below!
    }
    if (this.logger.dateFormatter.isPresent()) {
      this.logger.output.error.forEach(sink =>
        sink.write(
          chalk`[{${this.logger.dateColor} ${this.logger.dateFormatter.get()(
            new Date()
          )}}]`
        )
      )
    }
    this.logger.output.error.forEach(sink => sink.write(`[${this.source}]`))
    this.logger.output.error.forEach(sink =>
      sink.write(chalk`[{${this.logger.levelColors.error} error}]: `)
    )
    this.logger.output.error.forEach(sink =>
      args.forEach(arg => {
        if (typeof arg === 'string') {
          sink.write(arg)
        } else {
          sink.write(inspect(arg, false, 2, true))
        }
      })
    )
    this.logger.output.error.forEach(sink => sink.write(this.logger.lineEnd))
    return this
  }
  fatal<T extends any[]>(...args: T): this {
    if (this.logger.level > LogLevel.FATAL) {
      return // Disable logging if the level is below!
    }
    if (this.logger.dateFormatter.isPresent()) {
      this.logger.output.fatal.forEach(sink =>
        sink.write(
          chalk`[{${this.logger.dateColor} ${this.logger.dateFormatter.get()(
            new Date()
          )}}]`
        )
      )
    }
    this.logger.output.fatal.forEach(sink => sink.write(`[${this.source}]`))
    this.logger.output.fatal.forEach(sink =>
      sink.write(chalk`[{${this.logger.levelColors.fatal} fatal}]: `)
    )
    this.logger.output.fatal.forEach(sink =>
      args.forEach(arg => {
        if (typeof arg === 'string') {
          sink.write(arg)
        } else {
          sink.write(inspect(arg, false, 2, true))
        }
      })
    )
    this.logger.output.fatal.forEach(sink => sink.write(this.logger.lineEnd))
    return this
  }
}
