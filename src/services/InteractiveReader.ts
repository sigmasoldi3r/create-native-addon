import { Inject, Service } from 'typedi'
import FlagReader from './FlagReader'

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

  /**
   * Starts collecting project information.
   */
  async collect() {
    if (this.flags.promptDisabled.getOr(false)) {
      return
    }
  }
}
