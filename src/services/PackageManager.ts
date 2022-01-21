import Container, { Inject, Service } from 'typedi'
import PackageManagerProvider from '../infrastructure/PackageManagerProvider'
import EnvInfoProvider from './EnvInfoProvider'
import YarnProvider from './YarnProvider'
import mkdirp from 'mkdirp'
import NameSanitizer from './NameSanitizer'
import JsonFile from './JsonFile'
import path from 'path'

/**
 * Initialized package manager.
 */
export class InitPackageManager {
  constructor(
    private readonly manager: PackageManager,
    readonly root: string
  ) {}

  private readonly json = Container.get(JsonFile).bound(
    path.join(this.root, 'package.json')
  )

  set private(is: boolean) {
    this.json.set('private', is)
  }

  set license(name: string) {
    this.json.set('license', name)
  }

  set description(value: string) {
    this.json.set('description', value)
  }
}

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
    return new InitPackageManager(this, name)
  }
}
