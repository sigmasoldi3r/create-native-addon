import Container, { Inject, Service } from 'typedi'
import PackageManagerProvider from '../infrastructure/PackageManagerProvider'
import EnvInfoProvider from './EnvInfoProvider'
import YarnProvider from './YarnProvider'
import mkdirp from 'mkdirp'
import NameSanitizer from './NameSanitizer'

/**
 * Manages package info and operations.
 */
@Service()
export default class PackageManager {
  constructor(
    @Inject() private readonly env: EnvInfoProvider,
    @Inject() private readonly sanitizer: NameSanitizer
  ) {}

  provider = Container.get(YarnProvider) as PackageManagerProvider

  /**
   * Creates the package information.
   */
  async create(name: string) {
    name = this.sanitizer.toKebab(name)
    mkdirp.sync(name)
    await this.provider.init(name)
  }
}
