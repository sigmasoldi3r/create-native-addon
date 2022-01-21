import 'reflect-metadata'
import Entry from 'ts-entry-point'
import Container from 'typedi'
import Logger from './services/Logger'
import OptionsProvider from './services/OptionsProvider'
import ProjectInfo from './services/ProjectInfo'

/**
 * Application entry point.
 */
@Entry
export default class Main {
  static log = Container.get(Logger).using(Main)
  static info = Container.get(ProjectInfo)
  static projectData = Container.get(OptionsProvider)

  /**
   * Entry point.
   */
  static async main(args: string[]) {
    this.log.debug(`Using ${args.length} arguments from CLI`)
    this.log.info(`Application version ${this.info.version}`)
    const projectData = await this.projectData.acquire()
    this.log.fine(projectData)
    this.log.fine(`Done!`)
    return 0
  }
}
