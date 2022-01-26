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
import AddonHpp from './templates/Addon.hpp'
import IndexJs from './templates/Index.js'
import IndexSpecJs from './templates/Index.spec.js'

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
    this.log.info('Initializing package file...')
    const pkg = await this.pkg.create(projectData.name)
    const namespace = projectData.name.replace(/-/g, '_')
    const files = Container.get(FileManager).bound(projectData.name)
    pkg.description = projectData.description
    pkg.private = projectData.private
    pkg.license = projectData.license
    this.log.warn(
      `Currently the only supported template is the N-API skeleton!`
    )
    this.log.warn(
      `Feel free to open a pull request at any time at https://github.com/sigmasoldi3r/create-native-addon/issues`
    )
    await pkg.install('node-addon-api')
    this.log.fine(`Initializing testing framework...`)
    await pkg.install('mocha', true)
    await pkg.install('chai', true)
    pkg.addScript(`test`, `mocha index.spec.js`)
    pkg.addScript(`start`, `node .`)
    files.write(`index.spec.js`, IndexSpecJs({ namespace }))
    files.write(`index.js`, IndexJs({ namespace }))
    this.log.fine(`Writing addon data...`)
    files.dir('src')
    files.write('src/addon.cpp', AddonCpp({ namespace }))
    files.write('src/addon.hpp', AddonHpp({ namespace }))
    this.log.fine(`Installing packages...`)
    this.log.fine(`Initializing native compilers...`)
    await pkg.install('node-gyp', true)
    this.log.fine(`Writing bindings file...`)
    // -- WRITE PROJECT FILES -- //
    files.json.write('binding.gyp', {
      targets: [
        {
          target_name: namespace,
          sources: ['src/addon.cpp'],
          'cflags!': ['-fno-exceptions'],
          'cflags_cc!': ['-fno-exceptions'],
          include_dirs: ['<!@(node -p "require(\'node-addon-api\').include")'],
          defines: ['NAPI_DISABLE_CPP_EXCEPTIONS'],
        },
      ],
    })
    pkg.addScript(`gyp:config`, `node-gyp configure build`)
    let errors: Error[] = []
    try {
      await pkg.runScript(`gyp:config`)
    } catch (err) {
      this.log.error(
        `Failed to configure project, check the errors at the end, you'll have to configure the project later.`
      )
      errors.push(err)
    }
    this.log.fine(`Done!`)
    if (errors.length > 0) {
      errors.forEach(e => this.log.error(e))
      this.log.warn(`Some steps require your attention!`)
    }
    return 0
  }
}
