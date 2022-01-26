import { Inject, Service } from 'typedi'
import PackageManagerProvider from '../infrastructure/PackageManagerProvider'
import ProcessRunner from './ProcessRunner'

@Service()
export default class YarnProvider implements PackageManagerProvider {
  constructor(@Inject() private readonly proc: ProcessRunner) {}
  async init(cwd: string): Promise<void> {
    await this.proc.run(`yarn init -y`, { cwd })
  }
  async install(what: string, cwd: string, development = false) {
    await this.proc.run(`yarn add ${development ? '-D' : ''} ${what}`, { cwd })
  }
  async run(script: string, cwd: string): Promise<void> {
    await this.proc.run(`yarn ${script}`, { cwd })
  }
}
