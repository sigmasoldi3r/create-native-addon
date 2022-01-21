import { prompt } from 'enquirer'
import Container, { Inject, Service } from 'typedi'
import FlagReader, { Flags } from './FlagReader'
import Logger from './Logger'
import { ProjectOptions, SkipList } from './OptionsProvider'

export const PROMPTS = [
  {
    name: 'name',
    message: 'Name of the project:',
    default: 'my-native-addon',
    type: 'input',
  },
  {
    name: 'description',
    message: 'A brief description:',
    default: '',
    type: 'input',
  },
] as {
  name: Flags
  message: string
  default?: string
  required?: boolean
  type: string
}[]

/**
 * Asks the user via interactive prompts for the project
 * information, if necessary.
 *
 * Present information provided via CLI arguments is then
 * assumed to have a higher impact than the interactive,
 * and thus is discarded form prompting. (This means that
 * already existing information provided via flags is not
 * prompted again to the user).
 */
@Service()
export default class InteractiveReader {
  constructor(@Inject() private readonly flags: FlagReader) {}

  readonly log = Container.get(Logger).using(InteractiveReader)

  /**
   * Starts collecting project information.
   */
  async collect(skipList: SkipList = {}) {
    const collected = await prompt(
      PROMPTS.filter(prompt => !(prompt.name in skipList))
    )
    const result: Partial<ProjectOptions> = {}
    for (const key in collected) {
      result[key as keyof typeof result] =
        collected[key as keyof typeof collected]
    }
    return result
  }
}
