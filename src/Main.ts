import 'reflect-metadata'
import Entry from 'ts-entry-point'
import Container from 'typedi'
import Logger from './services/Logger'
import OptionsProvider from './services/OptionsProvider'
import PackageManager from './services/PackageManager'
import ProjectInfo from './services/ProjectInfo'

/**
 * Application entry point.
 */
@Entry
export default class Main {
  static log = Container.get(Logger).using(Main)
  static info = Container.get(ProjectInfo)
  static projectData = Container.get(OptionsProvider)
  static pkg = Container.get(PackageManager)

  /**
   * Entry point.
   */
  static async main(args: string[]) {
    this.log.debug(`Using ${args.length} arguments from CLI`)
    this.log.info(`Application version ${this.info.version}`)
    const projectData = await this.projectData.acquire()
    this.log.debug('Input data: ', projectData)
    this.pkg.create(projectData.name)
    this.log.fine(`Done!`)
    return 0
  }
}
