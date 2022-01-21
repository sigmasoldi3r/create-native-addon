import Container, { Inject, Service } from 'typedi'
import FlagReader from './FlagReader'
import InteractiveReader from './InteractiveReader'
import Logger from './Logger'

/**
 * Project options result.
 */
export interface ProjectOptions {
  name: string
  description: string
  private?: boolean
  license?: string
}

export type SkipList = { [K in keyof ProjectOptions]?: true }

/**
 * This service is in charge of selecting the appropriate
 * input method for project options, in each case.
 *
 * Cases where interactive input will be totally discarded:
 * If the environment is not interactive (In this case, you
 * must provide ALL options via flags and such).
 * If the flag --no-prompt is provided.
 */
@Service()
export default class OptionsProvider {
  constructor(
    @Inject() private readonly flags: FlagReader,
    @Inject() private readonly reader: InteractiveReader
  ) {}

  private readonly log = Container.get(Logger).using(OptionsProvider)

  /**
   * Starts collecting the options of the project.
   */
  async acquire(): Promise<ProjectOptions> {
    const result: ProjectOptions = {
      name: 'my-native-addon',
      description: '',
    }
    const skip: SkipList = {}
    this.flags.name.ifPresent(value => {
      result.name = value
      skip.name = true
    })
    this.flags.description.ifPresent(value => {
      result.description = value
      skip.description = true
    })
    this.flags.isPrivate.ifPresent(value => {
      result.private = value
      skip.private = true
    })
    this.flags.license.ifPresent(value => {
      result.license = value
      skip.license = true
    })
    if (!process.stdin.isTTY) {
      this.log.info(`No TTY found for this session, input prompt is disabled.`)
    } else if (this.flags.yesToAll.getOr(false)) {
      this.log.info(`Yes-to-all flag received, input prompt is disabled.`)
    } else {
      this.log.info(`Interactive prompt is enabled!`)
      const output = await this.reader.collect(skip)
      return { ...result, ...output }
    }
    return result
  }
}
