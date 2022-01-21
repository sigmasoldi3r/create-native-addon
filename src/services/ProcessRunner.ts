import { exec, ExecOptions } from 'child_process'
import Container, { Service } from 'typedi'
import Logger from './Logger'

/**
 * Wrapper around process spawning.
 */
@Service()
export default class ProcessRunner {
  private readonly log = Container.get(Logger).using(ProcessRunner)

  /**
   * Spawns an asynchronous process.
   */
  async run(command: string, options: ExecOptions = {}) {
    this.log.debug(`Spawning "${command}"...`)
    return new Promise((r, j) => {
      exec(command, options, (error, stdout, stderr) => {
        if (error == null) {
          r(stdout)
        } else {
          j({ error, stderr })
        }
      })
    })
  }
}
