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
}

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

  async acquire(): Promise<ProjectOptions> {
    const result = {
      name: 'my-native-addon',
      description: '',
    }
    for (const [key, value] of this.flags) {
      if (value.isPresent()) {
        result[key] = value.get()
      }
    }
    if (!process.stdin.isTTY) {
      this.log.info(`No TTY found for this session, input prompt is disabled.`)
    } else if (this.flags.promptDisabled.getOr(false)) {
      this.log.info(`Prompt disable flag received, input prompt is disabled.`)
    } else {
      await this.reader.collect(result)
    }
    return result
  }
}
