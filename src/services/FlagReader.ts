import { program } from 'commander'
import Container, { Inject, Service } from 'typedi'
import Option, { none, some } from '../infrastructure/Option'
import Logger, { LogLevel, LogLevelName, LogLevels } from './Logger'
import ProjectInfo from './ProjectInfo'

export type Flags = typeof FlagReader.keys[number]

/**
 * Service wrapper for the commander input.
 *
 * Abstraction layer that provides flags from CLI options in
 * a non-interactive way.
 */
@Service()
export default class FlagReader {
  readonly yesToAll = none<boolean>()
  readonly logLevel = none<LogLevel>()
  readonly name = none<string>()
  readonly description = none<string>()
  readonly license = none<string>()
  readonly isPrivate = none<boolean>()
  // readonly

  private readonly log = Container.get(Logger).using(FlagReader)

  constructor(@Inject() private readonly info: ProjectInfo) {
    program
      .version(info.version)
      .option(
        '--yes, -y',
        'Assumes positive input for all, disables the interactive prompting'
      )
      .option('--log-level <level>', 'Sets the log level of the project')
      .option('--private, -p', 'Marks the package as private')
      .option('--name <name>, -n', 'Sets the name of the project')
      .option(
        '--description <description>, -d',
        'Sets the description of the project'
      )
      .option('--license <name>', 'Specify a custom license other than MIT')
    program.parse(process.argv)
    const opts = program.opts()
    this.bake('yesToAll', opts.Y)
    this.bake('name', opts.name)
    this.bake('description', opts.description)
    this.bake('isPrivate', opts.P)
    this.bake('license', opts.license)
    const targetLevel =
      LogLevels[opts.logLevel?.toUpperCase() as any as LogLevelName]
    if (targetLevel != null) {
      this.logLevel = some(targetLevel)
    }
    const logger = Container.get(Logger)
    logger.level = this.logLevel.getOr(logger.level)
    this.log.trace('Input options ', opts)
  }

  /**
   * Bakes the value.
   */
  private bake(opt: keyof this, value: any) {
    if (value != null) {
      this[opt] = some(value) as any
    }
  }

  static readonly keys = ['name', 'description', 'private', 'license'] as const;

  *[Symbol.iterator](): Iterator<[Flags, Option<any>]> {
    yield ['name', this.name]
    yield ['description', this.description]
    yield ['private', this.isPrivate]
    yield ['license', this.license]
  }
}
