import { program } from 'commander'
import { Inject, Service } from 'typedi'
import { none, some } from '../infrastructure/Option'
import ProjectInfo from './ProjectInfo'

/**
 * Service wrapper for the commander input.
 *
 * Abstraction layer that provides flags from CLI options in
 * a non-interactive way.
 */
@Service()
export default class FlagReader {
  readonly promptDisabled = none<boolean>()

  constructor(@Inject() private readonly info: ProjectInfo) {
    program
      .version(info.version)
      .option('--no-prompt', 'Disables the interactive prompting')
    const opts = program.opts()
    this.promptDisabled = some(opts.noPrompt)
  }
}
