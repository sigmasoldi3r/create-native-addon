import path from 'path'
import 'reflect-metadata'
import Entry from 'ts-entry-point'
import Container from 'typedi'
import FileManager from './services/FileManager'
import JsonFile from './services/JsonFile'
import Logger from './services/Logger'
import OptionsProvider from './services/OptionsProvider'
import PackageManager from './services/PackageManager'
import ProjectInfo from './services/ProjectInfo'
import AddonCpp from './templates/Addon.cpp'

/**
 * Application entry point.
 */
@Entry
export default class Main {
  static log = Container.get(Logger).using(Main)
  static info = Container.get(ProjectInfo)
  static projectData = Container.get(OptionsProvider)
  static pkg = Container.get(PackageManager)
  static json = Container.get(JsonFile)

  /**
   * Entry point.
   */
  static async main(args: string[]) {
    this.log.debug(`Using ${args.length} arguments from CLI`)
    this.log.info(`Application version ${this.info.version}`)
    const projectData = await this.projectData.acquire()
    this.log.debug('Input data: ', projectData)
    const pkg = await this.pkg.create(projectData.name)
    pkg.description = projectData.description
    pkg.private = projectData.private
    pkg.license = projectData.license
    this.log.warn(
      `Currently the only supported template is the N-API skeleton!`
    )
    this.log.warn(
      `Feel free to open a pull request at any time at https://github.com/sigmasoldi3r/create-native-addon/issues`
    )
    this.log.fine(`Writing bindings file...`)
    // -- WRITE PROJECT FILES -- //
    const files = Container.get(FileManager).bound(projectData.name)
    files.json.write('binding.gyp', {
      targets: [
        {
          target_name: projectData.name,
          sources: ['src/addon.cpp'],
        },
      ],
    })
    const namespace = projectData.name.replace(/-/g, '_')
    files.dir('src')
    files.write('src/addon.cpp', AddonCpp({ namespace }))
    this.log.fine(`Done!`)
    return 0
  }
}
