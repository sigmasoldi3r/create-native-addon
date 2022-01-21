import { Service } from 'typedi'

/**
 * Implicit environment information.
 */
@Service()
export default class EnvInfoProvider {
  workingDir = process.cwd()
}
